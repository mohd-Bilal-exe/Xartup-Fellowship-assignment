

import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getAllCompanies = async (filters: any) => {
  const { search, industry, stage, page, limit, sortBy, sortOrder } = filters;
  const skip = (page - 1) * limit;

  const where: any = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { summary: { contains: search } },
          { keywords: { contains: search } }
        ]
      } : {},
      industry ? { industry } : {},
      stage ? { stage } : {}
    ]
  };

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: { signals: true }
    }),
    prisma.company.count({ where })
  ]);

  return {
    data: companies,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getCompanyById = async (id: string) => {
  return prisma.company.findUnique({
    where: { id },
    include: { signals: true, notes: true, sources: true }
  });
};

export const enrichCompany = async (id: string) => {
  console.log(`Starting enrichment for company ID: ${id}`);
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) {
    console.error(`Company with ID ${id} not found.`);
    throw new Error('Company not found');
  }

  // 1. Scrape content
  const targetUrl = company.url.startsWith('http') ? company.url : `https://${company.url}`;
  const jinaUrl = `https://r.jina.ai/${targetUrl}`;
  
  console.log(`Scraping content from: ${jinaUrl}`);
  let markdown = '';
  try {
    const { data } = await axios.get(jinaUrl);
    markdown = data;
    console.log(`Scraped ${markdown.length} characters of content.`);
  } catch (error: any) {
    console.error(`Jina AI Scrape failed for ${targetUrl}:`, error.message);
    throw new Error(`Scraping failed: ${error.message}`);
  }

  // 2. Extract using Gemini
  console.log('Starting Gemini AI extraction...');
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Extract information from the following markdown content of a company website.
      Provide the result in valid JSON format with parameters:
      - summary (1-2 sentences)
      - description (3-6 bullets explaining what they do)
      - keywords (5-10 comma-separated)
      - industry
      - location
      - signals (array of objects with { label, value }). Specifically look for:
          - "Careers Page"
          - "Recent Blog/News"
          - "Changelog"
          - "Product Type"
      
      Markdown:
      ${markdown.substring(0, 15000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini extraction successful.');
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to find JSON in AI response:', text);
      throw new Error('Failed to parse AI response');
    }
    const extractedData = JSON.parse(jsonMatch[0]);

    // 3. Update DB
    console.log('Updating database with enriched data...');
    return prisma.company.update({
      where: { id },
      data: {
        summary: extractedData.summary,
        description: Array.isArray(extractedData.description) ? extractedData.description.join('\n') : extractedData.description,
        keywords: extractedData.keywords,
        industry: extractedData.industry,
        location: extractedData.location,
        lastEnrichedAt: new Date(),
        sources: {
          create: {
            url: company.url
          }
        },
        signals: {
          deleteMany: {},
          create: (extractedData.signals || []).map((s: any) => ({ label: s.label, value: s.value }))
        }
      },
      include: { signals: true, sources: true, notes: true }
    });
  } catch (error: any) {
    console.error('Gemini AI Extraction/DB Update failed:', error.message);
    throw new Error(`Enrichment failed: ${error.message}`);
  }
};

export const addNote = async (companyId: string, content: string) => {
  return prisma.note.create({
    data: {
      content,
      companyId
    }
  });
};
