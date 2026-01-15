import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, nickname, oldPassword, newPassword } = body;

  if (!userId || !newPassword || newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required and new password must be at least 6 characters'
    });
  }

  try {
    // Check if user exists and has password
    const checkStmt = db.prepare('SELECT password FROM users WHERE user_id = ?');
    const user = checkStmt.get(userId) as any;

    if (!user) {
      // If user doesn't exist, create it (if nickname provided)
      if (!nickname) {
        throw createError({
           statusCode: 404,
           message: 'User not found and nickname not provided for registration'
        });
      }
      
      const insertStmt = db.prepare('INSERT INTO users (user_id, nickname, password) VALUES (?, ?, ?)');
      insertStmt.run(userId, nickname, newPassword);
      
      return {
        success: true,
        message: 'Password set and user created successfully'
      };
    }

    // If user already has a password, verify old password
    if (user.password) {
      if (!oldPassword) {
        throw createError({
          statusCode: 400,
          message: 'Current password is required'
        });
      }
      if (user.password !== oldPassword) {
        throw createError({
          statusCode: 401,
          message: 'Incorrect current password'
        });
      }
    }

    // Update password
    const updateStmt = db.prepare('UPDATE users SET password = ? WHERE user_id = ?');
    updateStmt.run(newPassword, userId);

    return {
      success: true,
      message: 'Password set successfully'
    };
  } catch (error: any) {
    console.error('Set password failed:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error'
    });
  }
});
