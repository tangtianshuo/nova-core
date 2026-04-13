import { Request, Response, NextFunction } from 'express';
import { getLatestVersion } from './version.service.js';

export async function getVersion(_req: Request, res: Response, next: NextFunction) {
  try {
    const versionInfo = await getLatestVersion();
    res.json(versionInfo);
  } catch (error) {
    next(error);
  }
}
