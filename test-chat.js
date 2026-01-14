// 测试聊天功能的简单脚本
import { io } from 'socket.io-client';

// 连接到WebSocket服务器
const socket = io('http://localhost:3000', {
  path: '/socket.io'
});

console.log('正在连接到WebSocket服务器...');

// 连接事件
socket.on('connect', () => {
  console.log('WebSocket连接成功！');
  
  // 登录
  socket.emit('login', {
    userId: 'test_user',
    nickname: 'Test User'
  });
});

// 登录成功事件
socket.on('login_success', () => {
  console.log('登录成功！');
  
  // 加入公共聊天室
  socket.emit('join_room', 'public');
});

// 加入房间成功事件
socket.on('room_joined', (data) => {
  console.log('加入房间成功:', data);
  console.log('在线用户数:', data.onlineCount);
  
  // 发送测试消息
  setTimeout(() => {
    socket.emit('send_message', {
      roomId: 'public',
      content: 'Hello from test script!',
      messageType: 'text'
    });
    console.log('发送测试消息');
  }, 1000);
});

// 收到新消息事件
socket.on('new_message', (message) => {
  console.log('收到新消息:', message);
  console.log('发送者:', message.nickname);
  console.log('内容:', message.content);
  
  // 断开连接
  setTimeout(() => {
    socket.disconnect();
    console.log('断开WebSocket连接');
  }, 2000);
});

// 错误事件
socket.on('error', (error) => {
  console.error('WebSocket错误:', error);
});

// 断开连接事件
socket.on('disconnect', () => {
  console.log('WebSocket连接已断开');
  process.exit();
});

// 超时处理
setTimeout(() => {
  console.error('测试超时，连接失败');
  socket.disconnect();
  process.exit(1);
}, 10000);
