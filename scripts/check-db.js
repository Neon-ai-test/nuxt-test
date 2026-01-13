import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前脚本目录的绝对路径
const __dirname = dirname(fileURLToPath(import.meta.url));
// 数据库文件在项目根目录（脚本目录的上级目录）
const dbPath = join(__dirname, '..', 'app.db');

console.log(`Checking database at: ${dbPath}`);

try {
  const db = new Database(dbPath, { readonly: true });
  
  // 查询所有记录
  const records = db.prepare('SELECT * FROM logs ORDER BY created_at DESC').all();
  
  console.log('\n=== 当前数据库中的日志 (logs) ===');
  if (records.length === 0) {
    console.log('(空) 还没有任何记录');
  } else {
    console.table(records);
  }
  console.log('==========================\n');
  
  db.close();
} catch (error) {
  console.error('Error reading database:', error.message);
}
