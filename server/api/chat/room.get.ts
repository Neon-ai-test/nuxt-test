import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const roomId = query.roomId as string;

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'Missing roomId parameter'
    });
  }

  try {
    const stmt = db.prepare(`
      SELECT id, room_id as roomId, name, type, created_by as createdBy, created_at as createdAt
      FROM rooms
      WHERE room_id = ?
    `);

    const room = stmt.get(roomId);

    if (!room) {
      return {
        success: false,
        message: 'Room not found'
      };
    }

    return {
      success: true,
      data: room
    };
  } catch (error) {
    console.error('获取房间信息失败:', error);
    throw createError({
      statusCode: 500,
      message: '获取房间信息失败'
    });
  }
});
