import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event);
    if (!files || files.length === 0) {
      throw createError({ statusCode: 400, message: 'No file uploaded' });
    }

    const file = files[0];
    const mimeType = file.type || '';
    
    // Determine file type
    let messageType = 'file';
    if (mimeType.startsWith('image/')) {
      messageType = 'image';
    } else if (mimeType.startsWith('video/')) {
      messageType = 'video';
    }

    // Generate safe filename
    const originalName = file.filename || 'unknown';
    const ext = originalName.split('.').pop() || 'bin';
    const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000)}.${ext}`;
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    // Save file
    await writeFile(join(uploadDir, filename), file.data);

    return {
      success: true,
      data: {
        url: `/uploads/${filename}`,
        type: messageType,
        filename: originalName,
        size: file.data.length
      }
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'File upload failed'
    });
  }
});
