import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { roomId, userId } = body;

  if (!roomId || !userId) {
    throw createError({
      statusCode: 400,
      message: 'Missing required parameters'
    });
  }

  try {
    // 1. 检查房间是否存在以及创建者是否匹配
    const checkStmt = db.prepare('SELECT created_by FROM rooms WHERE room_id = ?');
    const room = checkStmt.get(roomId);

    if (!room) {
      return {
        success: false,
        message: '房间不存在'
      };
    }

    // 这里做一个简单的权限检查，实际项目可能需要更严谨的验证
    if (room.created_by !== userId) {
      return {
        success: false,
        message: '只有房主可以删除房间'
      };
    }

    // 2. 删除房间
    const deleteRoomStmt = db.prepare('DELETE FROM rooms WHERE room_id = ?');
    deleteRoomStmt.run(roomId);

    // 3. 删除房间内的消息
    const deleteMessagesStmt = db.prepare('DELETE FROM messages WHERE room_id = ?');
    deleteMessagesStmt.run(roomId);

    return {
      success: true,
      message: '房间已删除'
    };
  } catch (error) {
    console.error('删除房间失败:', error);
    throw createError({
      statusCode: 500,
      message: '删除房间失败'
    });
  }
});
