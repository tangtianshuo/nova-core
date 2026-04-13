/**
 * Compression utilities for rotated log files
 *
 * Features:
 * - Gzip compression for .log files
 * - Compression watcher for automated processing
 * - Integration with pino-roll rotation
 *
 * Implements: LOG-07
 */

import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream, unlink } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

/**
 * Compress a file to .gz format and optionally delete the original
 */
async function compressAndDelete(filePath: string): Promise<string> {
  const compressedPath = filePath + '.gz';
  const gzip = createGzip({ level: 6 });

  await pipeline(
    createReadStream(filePath),
    gzip,
    createWriteStream(compressedPath)
  );

  await new Promise<void>((resolve, reject) => {
    unlink(filePath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  return compressedPath;
}

/**
 * Options for compression watcher
 */
interface CompressionWatcherOptions {
  /** Directory to monitor for rotated log files */
  logDir: string;
  /** Interval in milliseconds between checks (default: 60000) */
  intervalMs?: number;
  /** Only compress files older than this many hours (default: 1) */
  maxAgeHours?: number;
}

/**
 * Create a compression watcher that monitors a log directory
 * and compresses rotated .log files that are older than maxAgeHours
 *
 * @param options - Watcher configuration options
 * @returns Object with stop function to halt the watcher
 */
export async function createCompressionWatcher(
  options: CompressionWatcherOptions
): Promise<{ stop: () => void }> {
  const { logDir, intervalMs = 60000, maxAgeHours = 1 } = options;
  const processedFiles = new Set<string>();
  let intervalId: ReturnType<typeof setInterval>;

  async function compressOldLogs(): Promise<void> {
    try {
      const entries = await readdir(logDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const dateDir = join(logDir, entry.name);
        const files = await readdir(dateDir, { withFileTypes: true });

        for (const file of files) {
          if (!file.name.endsWith('.log') || file.name.endsWith('.gz')) continue;

          const filePath = join(dateDir, file.name);

          // Skip if already processed or currently being written
          if (processedFiles.has(filePath)) continue;

          // Check file age
          const stats = await stat(filePath);
          const ageHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);

          if (ageHours >= maxAgeHours) {
            processedFiles.add(filePath);
            try {
              await compressAndDelete(filePath);
              console.log(`Compressed: ${filePath} -> ${filePath}.gz`);
            } catch (err) {
              console.error(`Compression failed for ${filePath}:`, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Compression watcher error:', err);
    }
  }

  // Start watching
  intervalId = setInterval(compressOldLogs, intervalMs);

  // Return stop function
  return {
    stop: () => clearInterval(intervalId),
  };
}

export default {
  createCompressionWatcher,
};
