import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import searchController from '../controllers/search.controller.js';

const router = express.Router();

function validateSearchRequest(req: Request, res: Response, next: NextFunction) {
  const body: unknown = req.body;
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  const name = (body as Record<string, unknown>).name;
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Request body must include a non-empty string "name"' });
  }

  return next();
}

router.post('/search', validateSearchRequest, searchController);

export default router;