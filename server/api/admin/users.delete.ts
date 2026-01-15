import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, ids } = body;

  if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
    throw createError({
      statusCode: 400,
      message: 'User ID or IDs are required'
    });
  }

  try {
    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Batch delete
      const deleteUser = db.prepare('DELETE FROM users WHERE id = ?');
      const deleteMany = db.transaction((userIds) => {
        let changes = 0;
        for (const userId of userIds) {
          changes += deleteUser.run(userId).changes;
        }
        return changes;
      });
      
      const changes = deleteMany(ids);
      
      return {
        success: true,
        message: `${changes} users deleted successfully`
      };
    } else {
      // Single delete
      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      const result = stmt.run(id);

      if (result.changes === 0) {
        throw createError({
          statusCode: 404,
          message: 'User not found'
        });
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    }
  } catch (error: any) {
    console.error('Delete user failed:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error'
    });
  }
});
