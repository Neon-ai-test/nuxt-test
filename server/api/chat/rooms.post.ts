import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, createdBy } = body;

  if (!name || !createdBy) {
    throw createError({
      statusCode: 400,
      message: 'Room name and creator are required'
    });
  }

  try {
    // 生成唯一的房间 ID
    const roomId = 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const stmt = db.prepare(`
      INSERT INTO rooms (room_id, name, type, created_by)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(roomId, name, 'private', createdBy);

    return {
      success: true,
      data: {
        roomId,
        name,
        type: 'private',
        createdBy
      }
    };
  } catch (error) {
    console.error('创建房间失败:', error);
    throw createError({
      statusCode: 500,
      message: '创建房间失败'
    });
  }
});
