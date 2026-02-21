import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getLists = async (req: any, res: Response) => {
  try {
    const userId = req.userId as string;
    const lists = await prisma.list.findMany({
      where: { userId },
      include: {
        companies: true,
        _count: {
          select: { companies: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(lists);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createList = async (req: any, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    const list = await prisma.list.create({
      data: { 
        name,
        userId
      }
    });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addToList = async (req: any, res: Response) => {
  try {
    const { listId, companyId } = req.body;
    const userId = req.userId;

    // Verify ownership
    const list = await prisma.list.findFirst({
      where: { id: listId, userId }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found or unauthorized' });
    }

    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: {
        companies: {
          connect: { id: companyId }
        }
      }
    });
    res.json(updatedList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromList = async (req: any, res: Response) => {
  try {
    const { listId, companyId } = req.body;
    const userId = req.userId;

    // Verify ownership
    const list = await prisma.list.findFirst({
      where: { id: listId, userId }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found or unauthorized' });
    }

    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: {
        companies: {
          disconnect: { id: companyId }
        }
      }
    });
    res.json(updatedList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteList = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify ownership
    const list = await prisma.list.findFirst({
      where: { id: id as string, userId }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found or unauthorized' });
    }

    await prisma.list.delete({
      where: { id: id as string }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
