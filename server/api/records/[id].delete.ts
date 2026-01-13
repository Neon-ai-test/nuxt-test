export default defineEventHandler((event) => {
  // 从路由参数中获取 ID
  // 例如 /api/records/123 -> id = 123
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    });
  }

  const db = useDb();

  // 删除指定 ID 的记录
  const stmt = db.prepare('DELETE FROM daily_records WHERE id = ?');
  const info = stmt.run(id);

  if (info.changes === 0) {
    // 如果没有记录被删除（可能是 ID 不存在）
    return { success: false, message: 'Record not found' };
  }

  return {
    success: true,
    id
  };
});
