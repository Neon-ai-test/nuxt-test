import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { oldPassword, newPassword } = body;

  if (!newPassword || newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'New password must be at least 6 characters long'
    });
  }

  try {
    // Verify old password
    const checkStmt = db.prepare('SELECT value FROM system_config WHERE key = ?');
    const record: any = checkStmt.get('admin_password');

    if (!record || record.value !== oldPassword) {
      throw createError({
        statusCode: 401,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    const updateStmt = db.prepare('UPDATE system_config SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?');
    updateStmt.run(newPassword, 'admin_password');

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error: any) {
    console.error('Update password failed:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error'
    });
  }
});
