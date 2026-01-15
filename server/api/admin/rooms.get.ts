import db from '../../utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit) || 20;
  const offset = Number(query.offset) || 0;

  try {
    // Only fetch non-public rooms
    const countStmt = db.prepare("SELECT COUNT(*) as total FROM rooms WHERE type != 'public'");
    const { total } = countStmt.get();

    const stmt = db.prepare(`
      SELECT id, room_id, name, type, created_by, created_at
      FROM rooms
      WHERE type != 'public'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    const rooms = stmt.all(limit, offset);

    return {
      success: true,
      data: rooms,
      total
    };
  } catch (error: any) {
    console.error('Failed to fetch rooms:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal Server Error'
    });
  }
});
