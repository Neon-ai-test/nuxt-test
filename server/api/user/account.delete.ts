import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, password } = body;

  if (!userId || !password) {
    throw createError({
      statusCode: 400,
      message: 'User ID and password are required'
    });
  }

  try {
    // Verify user and password
    const checkStmt = db.prepare('SELECT password FROM users WHERE user_id = ?');
    const user = checkStmt.get(userId) as any;

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }

    if (!user.password) {
       throw createError({
        statusCode: 400,
        message: 'Please set a password first before deleting account'
      });
    }

    if (user.password !== password) {
      throw createError({
        statusCode: 401,
        message: 'Incorrect password'
      });
    }

    // Delete user
    const deleteUserStmt = db.prepare('DELETE FROM users WHERE user_id = ?');
    deleteUserStmt.run(userId);

    // Optionally delete user's messages or keep them?
    // Usually messages are kept or anonymized.
    // For this simple app, we'll keep them but they won't link to a valid user.
    // Or we can delete them. Let's just delete the user for now.
    
    // Also remove from online users if we had access to the socket server instance,
    // but this is a stateless API handler. The client should handle disconnect.

    return {
      success: true,
      message: 'Account deleted successfully'
    };
  } catch (error: any) {
    console.error('Delete account failed:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error'
    });
  }
});
