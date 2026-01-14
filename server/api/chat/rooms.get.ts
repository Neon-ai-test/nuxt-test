import db from '../../utils/db';

export default defineEventHandler(() => {
  try {
    const stmt = db.prepare(`
      SELECT id, room_id as roomId, name, type, created_by as createdBy, created_at as createdAt
      FROM rooms
      ORDER BY created_at DESC
    `);

    const rooms = stmt.all();

    return {
      success: true,
      data: rooms,
      total: rooms.length
    };
  } catch (error) {
    console.error('获取房间列表失败:', error);
    throw createError({
      statusCode: 500,
      message: '获取房间列表失败'
    });
  }
});
