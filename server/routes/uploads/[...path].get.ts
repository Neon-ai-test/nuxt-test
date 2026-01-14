import { join } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

const MIME_TYPES: Record<string, string> = {
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mov': 'video/quicktime',
  'avi': 'video/x-msvideo'
};

export default defineEventHandler(async (event) => {
  const pathParam = getRouterParam(event, 'path');
  if (!pathParam) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' });
  }

  // Prevent directory traversal
  if (pathParam.includes('..') || pathParam.includes('\0')) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid path' });
  }

  // Use process.cwd() to locate the public/uploads folder relative to the running process
  // In production, this maps to /www/wwwroot/chat-app/public/uploads
  const filePath = join(process.cwd(), 'public', 'uploads', pathParam);

  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
       throw createError({ statusCode: 404, statusMessage: 'File not found' });
    }

    const ext = pathParam.split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    setHeader(event, 'Content-Type', contentType);
    setHeader(event, 'Content-Length', stats.size);
    // Cache control for performance
    setHeader(event, 'Cache-Control', 'public, max-age=86400');
    
    return sendStream(event, createReadStream(filePath));
  } catch (err) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' });
  }
});
