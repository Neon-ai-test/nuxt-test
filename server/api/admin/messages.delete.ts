import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, ids } = body;

  if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
    throw createError({
      statusCode: 400,
      message: 'Message ID or IDs are required'
    });
  }

  try {
    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Batch delete
      const deleteMsg = db.prepare('DELETE FROM messages WHERE id = ?');
      const deleteMany = db.transaction((msgIds) => {
        let changes = 0;
        for (const msgId of msgIds) {
          changes += deleteMsg.run(msgId).changes;
        }
        return changes;
      });
      
      const changes = deleteMany(ids);
      
      return {
        success: true,
        message: `${changes} messages deleted successfully`
      };
    } else {
      // Single delete
      const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
      const result = stmt.run(id);

      if (result.changes === 0) {
        throw createError({
          statusCode: 404,
          message: 'Message not found'
        });
      }

      return {
        success: true,
        message: 'Message deleted successfully'
      };
    }
  } catch (error: any) {
    console.error('Delete message failed:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error'
    });
  }
});
