import { Server } from 'socket.io';
import http from 'http';
import db from '../utils/db';

// 在线用户管理
const onlineUsers = new Map<string, string>(); // socketId -> userId
const userSockets = new Map<string, string[]>(); // userId -> socketIds
const roomUsers = new Map<string, Set<string>>(); // roomId -> userIds

export default defineNitroPlugin((nitroApp) => {
  // 创建 HTTP 服务器
  const httpServer = http.createServer(toNodeListener(nitroApp.h3App));
  
  // 创建 Socket.IO 服务器
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/socket.io'
  });
  
  // 启动 HTTP 服务器
  const port = Number(process.env.WS_PORT) || 4000;
  httpServer.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
  });

  io.on('connection', (socket) => {
    console.log('用户连接:', socket.id);

    // 登录事件
    socket.on('login', (data) => {
      const { userId, nickname } = data;
      
      // 保存用户信息到数据库
      try {
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO users (user_id, nickname)
          VALUES (?, ?)
        `);
        stmt.run(userId, nickname);
      } catch (error) {
        console.error('保存用户信息失败:', error);
      }

      // 管理在线用户
      onlineUsers.set(socket.id, userId);
      
      if (!userSockets.has(userId)) {
        userSockets.set(userId, []);
      }
      userSockets.get(userId)?.push(socket.id);

      console.log(`用户 ${userId} 登录成功`);
      
      // 发送登录成功事件
      socket.emit('login_success', { userId, nickname });
    });

    // 加入房间
    socket.on('join_room', (roomId) => {
      const userId = onlineUsers.get(socket.id);
      if (!userId) return;

      socket.join(roomId);
      
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set());
      }
      roomUsers.get(roomId)?.add(userId);

      console.log(`用户 ${userId} 加入房间 ${roomId}`);
      
      // 广播用户加入事件
      socket.to(roomId).emit('user_joined', {
        roomId,
        userId
      });

      // 发送房间信息
      socket.emit('room_joined', {
        roomId,
        onlineCount: roomUsers.get(roomId)?.size || 0
      });
    });

    // 发送消息
    socket.on('send_message', (data) => {
      const { roomId, content, messageType = 'text' } = data;
      const userId = onlineUsers.get(socket.id);
      
      if (!userId) return;

      // 保存消息到数据库
      try {
        const stmt = db.prepare(`
          INSERT INTO messages (room_id, user_id, content, message_type)
          VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(roomId, userId, content, messageType);

        // 获取用户信息
        const userStmt = db.prepare('SELECT nickname FROM users WHERE user_id = ?');
        const user = userStmt.get(userId);

        const message = {
          id: result.lastInsertRowid,
          roomId,
          userId,
          content,
          messageType,
          nickname: user?.nickname || userId,
          createdAt: new Date().toISOString()
        };

        // 广播消息
        io.to(roomId).emit('new_message', message);
        console.log(`用户 ${userId} 在房间 ${roomId} 发送消息`);
      } catch (error) {
        console.error('保存消息失败:', error);
        socket.emit('error', { message: '发送消息失败' });
      }
    });

    // 离开房间
    socket.on('leave_room', (roomId) => {
      const userId = onlineUsers.get(socket.id);
      if (!userId) return;

      socket.leave(roomId);
      
      roomUsers.get(roomId)?.delete(userId);
      
      console.log(`用户 ${userId} 离开房间 ${roomId}`);
      
      // 广播用户离开事件
      socket.to(roomId).emit('user_left', {
        roomId,
        userId
      });
    });

    // 断开连接
    socket.on('disconnect', () => {
      const userId = onlineUsers.get(socket.id);
      if (!userId) return;

      // 从在线用户中移除
      onlineUsers.delete(socket.id);
      
      // 从用户套接字中移除
      const sockets = userSockets.get(userId);
      if (sockets) {
        const index = sockets.indexOf(socket.id);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        
        if (sockets.length === 0) {
          userSockets.delete(userId);
          
          // 从所有房间中移除用户
          roomUsers.forEach((users, roomId) => {
            if (users.has(userId)) {
              users.delete(userId);
              io.to(roomId).emit('user_left', {
                roomId,
                userId
              });
            }
          });
        }
      }

      console.log(`用户 ${userId} 断开连接`);
    });
  });

  console.log('WebSocket 服务已启动');
});
