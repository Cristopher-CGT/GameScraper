import type { Request, Response } from 'express';
import { searchService } from '../services/search.service.js';

async function searchController(req: Request, res: Response) {
  try {
    const results = await searchService(req.body.name.trim());
    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default searchController;