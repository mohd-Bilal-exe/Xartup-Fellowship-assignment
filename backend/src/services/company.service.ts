

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
    include: { signals: true, notes: true }
  });
};

export const enrichCompany = async (id: string) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) throw new Error('Company not found');

  // 1. Scrape content
  const jinaUrl = `https://r.jina.ai/${company.url}`;
  const { data: markdown } = await axios.get(jinaUrl);

  // 2. Extract using Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Extract information from the following markdown content of a company website.
    Provide the result in valid JSON format with parameters:
    - summary (1-2 sentences)
    - description (3-6 bullets)
    - keywords (5-10 comma-separated)
    - industry
    - location
    - signals (array of objects with { label, value })
    
    Markdown:
    ${markdown.substring(0, 15000)}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse AI response');
  const extractedData = JSON.parse(jsonMatch[0]);

  // 3. Update DB
  return prisma.company.update({
    where: { id },
    data: {
      summary: extractedData.summary,
      description: Array.isArray(extractedData.description) ? extractedData.description.join('\n') : extractedData.description,
      keywords: extractedData.keywords,
      industry: extractedData.industry,
      location: extractedData.location,
      signals: {
        deleteMany: {},
        create: extractedData.signals.map((s: any) => ({ label: s.label, value: s.value }))
      }
    },
    include: { signals: true }
  });
};
