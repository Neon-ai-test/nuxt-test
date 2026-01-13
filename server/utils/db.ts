import Database from 'better-sqlite3';

// 1. 初始化数据库连接
// 数据库文件将存储在项目根目录下，名为 'app.db'
const db = new Database('app.db');

// 2. 初始化表结构
// 如果表不存在，则创建它
const initScript = `
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    level TEXT DEFAULT 'info',
    image_path TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

db.exec(initScript);

// 尝试添加 image_path 列，以防它是旧表
try {
  db.exec("ALTER TABLE logs ADD COLUMN image_path TEXT");
} catch (error) {
  // 如果列已存在，会报错，忽略即可
  // console.log('Column image_path already exists or could not be added:', error.message);
}

// 3. 导出数据库实例供 API 使用
export const useDb = () => {
  return db;
};
