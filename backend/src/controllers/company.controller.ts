import type { Request, Response } from 'express';
import * as CompanyService from '../services/company.service.js';

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { search, industry, stage, page, limit, sortBy, sortOrder } = req.query;
    const result = await CompanyService.getAllCompanies({
      search: search as string,
      industry: industry as string,
      stage: stage as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      sortBy: (sortBy as string) || 'name',
      sortOrder: (sortOrder as 'asc' | 'desc') || 'asc'
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await CompanyService.getCompanyById(req.params.id as string);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const enrichCompany = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    const updatedCompany = await CompanyService.enrichCompany(req.params.id as string);
    res.json(updatedCompany);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addNote = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const note = await CompanyService.addNote(req.params.id as string, content);
    res.json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
