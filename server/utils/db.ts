import Database from 'better-sqlite3';
import { resolve } from 'path';

// 1. 初始化数据库连接
// 数据库文件路径可以通过环境变量配置，默认为项目根目录下的 'app.db'
const dbPath = process.env.DATABASE_PATH || resolve(process.cwd(), 'app.db');
const db = new Database(dbPath);

console.log(`Database connected at ${dbPath}`);

// 2. 初始化表结构
// 如果表不存在，则创建它
const initScript = `
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    avatar TEXT,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  -- 聊天室表
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'public',
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  -- 消息表
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 系统配置表
  CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  -- 创建索引
  CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id);
  CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
  
  -- 创建默认公共聊天室
  INSERT OR IGNORE INTO rooms (room_id, name, type)
  VALUES ('public', '公共聊天室', 'public');
`;

db.exec(initScript);

// 尝试添加 password 列（如果不存在，用于旧数据迁移）
try {
  db.prepare('ALTER TABLE users ADD COLUMN password TEXT').run();
} catch (error) {
  // 列可能已存在，忽略错误
}

// 3. 导出数据库实例供 API 使用
export const useDb = () => {
  return db;
};

// 4. 导出数据库实例
export default db;
