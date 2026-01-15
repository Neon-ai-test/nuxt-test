import db from '../../utils/db';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { roomId, userId, roomType, limit = 20, offset = 0 } = query;

  try {
    let sql = `
      SELECT m.id, m.room_id, m.user_id, m.content, m.message_type, m.created_at,
             u.nickname
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.user_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (roomId) {
      sql += ` AND m.room_id = ?`;
      params.push(roomId);
    }

    if (userId) {
      sql += ` AND m.user_id = ?`;
      params.push(userId);
    }

    if (roomType) {
        if (roomType === 'public') {
            sql += ` AND m.room_id = 'public'`;
        } else if (roomType === 'private') {
            sql += ` AND m.room_id != 'public'`;
        }
    }

    sql += ` ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const stmt = db.prepare(sql);
    const messages = stmt.all(...params);

    // Count
    let countSql = `SELECT COUNT(*) as total FROM messages m WHERE 1=1`;
    const countParams: any[] = [];
    
    if (roomId) {
        countSql += ` AND m.room_id = ?`;
        countParams.push(roomId);
    }
    if (userId) {
        countSql += ` AND m.user_id = ?`;
        countParams.push(userId);
    }
    if (roomType) {
        if (roomType === 'public') {
            countSql += ` AND m.room_id = 'public'`;
        } else if (roomType === 'private') {
            countSql += ` AND m.room_id != 'public'`;
        }
    }

    const total = db.prepare(countSql).get(...countParams).total;

    return {
      success: true,
      data: messages,
      total
    };
  } catch (error) {
    console.error('Fetch messages failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error'
    });
  }
});
