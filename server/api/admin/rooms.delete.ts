import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { roomId, ids } = body;

  if (!roomId && (!ids || !Array.isArray(ids) || ids.length === 0)) {
    throw createError({
      statusCode: 400,
      message: 'Room ID or IDs are required'
    });
  }

  const targetIds = ids || [roomId];

  // Double check it's not a public room
  const placeholders = targetIds.map(() => '?').join(',');
  const checkStmt = db.prepare(`SELECT type, room_id FROM rooms WHERE room_id IN (${placeholders})`);
  const rooms = checkStmt.all(...targetIds);

  if (rooms.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'No rooms found'
    });
  }

  const publicRooms = rooms.filter(r => r.type === 'public');
  if (publicRooms.length > 0) {
    throw createError({
      statusCode: 403,
      message: `Cannot delete public room(s): ${publicRooms.map(r => r.room_id).join(', ')}`
    });
  }

  try {
    const deleteTransaction = db.transaction((idsToDelete) => {
      // Delete messages first
      const deleteMsgs = db.prepare(`DELETE FROM messages WHERE room_id IN (${placeholders})`);
      deleteMsgs.run(...idsToDelete);

      // Delete room
      const deleteRoom = db.prepare(`DELETE FROM rooms WHERE room_id IN (${placeholders})`);
      return deleteRoom.run(...idsToDelete);
    });

    const result = deleteTransaction(targetIds);

    return {
      success: true,
      message: 'Rooms and associated messages deleted successfully'
    };
  } catch (error: any) {
    console.error('Delete room failed:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal Server Error'
    });
  }
});
