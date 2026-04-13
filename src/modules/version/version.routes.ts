import { Router } from 'express';
import { getVersion } from './version.controller.js';

const router = Router();

/**
 * GET /api/version/latest
 * Returns the latest version info from download server
 * Returns: { pub_date, version, release_notes, downloads: { win_x64: { name, url } } }
 */
router.get('/latest', getVersion);

export default router;
