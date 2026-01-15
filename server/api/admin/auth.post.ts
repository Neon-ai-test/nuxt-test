import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body;

  try {
    const stmt = db.prepare('SELECT value FROM system_config WHERE key = ?');
    const result: any = stmt.get('admin_password');

    // If not initialized in DB, we could optionally fallback to env var, 
    // but the requirement is to use the "Register" flow.
    // However, to prevent being locked out if something goes wrong, 
    // we can check if result is null. 
    // If null, it means not initialized.
    
    if (!result) {
       throw createError({
        statusCode: 403,
        message: 'System not initialized. Please register admin password first.'
      });
    }

    if (password === result.value) {
      return {
        success: true,
        token: 'admin-session-token-' + Date.now()
      };
    } else {
      throw createError({
        statusCode: 401,
        message: '密码错误'
      });
    }
  } catch (error: any) {
    // Pass through createError
    if (error.statusCode) throw error;
    
    console.error('Auth failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Authentication failed'
    });
  }
});
