import db from '../../utils/db';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { userId } = query;

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    });
  }

  try {
    const stmt = db.prepare('SELECT password FROM users WHERE user_id = ?');
    const user = stmt.get(userId as string) as any;

    if (!user) {
       return {
        hasPassword: false,
        exists: false
      };
    }

    return {
      hasPassword: !!user.password,
      exists: true
    };
  } catch (error) {
    console.error('Check user status failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error'
    });
  }
});
