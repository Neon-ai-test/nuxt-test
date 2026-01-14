import db from '../../utils/db';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { roomId, limit = 50, offset = 0 } = query;

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'Room ID is required'
    });
  }

  try {
    const stmt = db.prepare(`
      SELECT m.id, m.room_id as roomId, m.user_id as userId, m.content, 
             m.message_type as messageType, m.created_at as createdAt, 
             u.nickname
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.user_id
      WHERE m.room_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `);

    const messages = stmt.all(roomId, parseInt(limit as string), parseInt(offset as string));

    return {
      success: true,
      data: messages.reverse(),
      total: messages.length
    };
  } catch (error) {
    console.error('获取消息失败:', error);
    throw createError({
      statusCode: 500,
      message: '获取消息失败'
    });
  }
});
