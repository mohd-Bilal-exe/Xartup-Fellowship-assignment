import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getSavedSearches = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const searches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(searches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSavedSearch = async (req: any, res: Response) => {
  try {
    const { name, query, filters } = req.body;
    const userId = req.userId;
    const search = await prisma.savedSearch.create({
      data: {
        name,
        query,
        filters: typeof filters === 'string' ? filters : JSON.stringify(filters),
        userId
      }
    });
    res.json(search);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSavedSearch = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify ownership
    const search = await prisma.savedSearch.findFirst({
      where: { id: id as string, userId }
    });

    if (!search) {
      return res.status(404).json({ error: 'Saved search not found or unauthorized' });
    }

    await prisma.savedSearch.delete({
      where: { id: id as string }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
