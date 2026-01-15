import db from '../../utils/db';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { search, limit = 20, offset = 0 } = query;

  try {
    let sql = `
      SELECT id, user_id, nickname, avatar, created_at 
      FROM users 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (user_id LIKE ? OR nickname LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const stmt = db.prepare(sql);
    const users = stmt.all(...params);

    // Get total count for pagination
    let countSql = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
    const countParams: any[] = [];
    if (search) {
      countSql += ` AND (user_id LIKE ? OR nickname LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const total = db.prepare(countSql).get(...countParams).total;

    return {
      success: true,
      data: users,
      total
    };
  } catch (error) {
    console.error('Fetch users failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error'
    });
  }
});
