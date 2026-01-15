import db from '../../utils/db';

export default defineEventHandler(() => {
  try {
    const stmt = db.prepare('SELECT value FROM system_config WHERE key = ?');
    const result = stmt.get('admin_password');

    return {
      initialized: !!result
    };
  } catch (error) {
    console.error('Check admin status failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error'
    });
  }
});
