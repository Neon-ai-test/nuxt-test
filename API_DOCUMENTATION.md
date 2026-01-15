# Nuxt 聊天室 API 接口文档 (线上环境)

本文档适用于 Uniapp 客户端开发。

## 基础配置
- **服务器域名**: `https://chat.mltext.top`
- **HTTP 接口 Base URL**: `https://chat.mltext.top/api`
- **WebSocket 地址**: `https://chat.mltext.top` (自动升级为 wss)
- **静态资源 (图片/文件) 前缀**: `https://chat.mltext.top`

---

## 1. HTTP 接口
**注意**：所有请求请拼接 Base URL。

### 1.1 获取房间列表
获取所有已创建的公共/私密房间。

- **URL**: `/chat/rooms`
- **完整请求**: `GET https://chat.mltext.top/api/chat/rooms`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "roomId": "public",
      "name": "公共聊天室",
      "type": "public",
      "createdBy": "system",
      "createdAt": "2024-03-20T10:00:00.000Z"
    }
  ],
  "total": 1
}
```

### 1.2 获取房间详情
获取指定房间的详细信息。

- **URL**: `/chat/room`
- **完整请求**: `GET https://chat.mltext.top/api/chat/room?roomId=xxx`
- **Query**:
    - `roomId` (Required): 房间ID
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "roomId": "room_123456",
    "name": "私密房间",
    "type": "private",
    "createdBy": "user_123",
    "createdAt": "2024-03-20T10:00:00.000Z"
  }
}
```

### 1.3 创建房间
创建一个新的私密房间。

- **URL**: `/chat/rooms`
- **完整请求**: `POST https://chat.mltext.top/api/chat/rooms`
- **Body**:
```json
{
  "name": "我的房间",
  "createdBy": "user_123"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "roomId": "room_1710928800000_abc123",
    "name": "我的房间",
    "type": "private",
    "createdBy": "user_123"
  }
}
```

### 1.4 删除房间
删除指定的房间（仅房主可删除）。

- **URL**: `/chat/room`
- **完整请求**: `DELETE https://chat.mltext.top/api/chat/room`
- **Body**:
```json
{
  "roomId": "room_1710928800000_abc123",
  "userId": "user_123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "房间已删除"
}
```

### 1.5 获取历史消息
分页获取指定房间的历史消息。

- **URL**: `/chat/messages`
- **完整请求**: `GET https://chat.mltext.top/api/chat/messages?roomId=public&limit=50`
- **Query**:
    - `roomId` (Required): 房间ID
    - `limit`: 每页数量 (默认 50)
    - `offset`: 偏移量 (默认 0)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 100,
      "roomId": "public",
      "userId": "user_123",
      "content": "Hello World", // 文本内容或文件相对路径
      "messageType": "text", // text, image, video, audio, file
      "nickname": "张三",
      "createdAt": "2024-03-20T10:00:00.000Z"
    }
  ],
  "total": 100
}
```
> **重要**：如果 `messageType` 是图片/音频/视频，返回的 `content` 是相对路径（如 `/uploads/xxx.png`）。在 Uniapp 展示时，请务必拼接服务器域名：`https://chat.mltext.top/uploads/xxx.png`。

### 1.6 文件上传
上传图片、视频、音频或其他文件。

- **URL**: `/upload`
- **完整请求**: `POST https://chat.mltext.top/api/upload`
- **Header**: `Content-Type: multipart/form-data`
- **Body**:
    - `file`: (File Object)
- **Response**:
```json
{
  "success": true,
  "data": {
    "url": "/uploads/1710928800000-123456.png", // 相对路径
    "type": "image",
    "filename": "original.png",
    "size": 102400
  }
}
```

---

## 2. WebSocket 接入 (Uniapp)

Uniapp 建议使用 `socket.io-client` 的兼容版本或相关插件。

### 2.1 初始化连接
```javascript
// 引入 socket.io-client
import io from '@hyoga/uni-socket.io'; // 或其他适用于 uniapp 的库

const socket = io('https://chat.mltext.top', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  secure: true,
});
```

### 2.2 关键流程

1.  **连接建立后**：立即发送 `login` 事件。
2.  **进入页面**：发送 `join_room` 事件。
3.  **发送消息**：
    *   **文本**：直接调用 `send_message`。
    *   **图片/语音**：先调用 **1.6 文件上传接口**，获取到 `url` 后，再调用 `send_message`，将 `content` 设置为该 url，并指定正确的 `messageType`。

### 2.3 事件定义

**发送 (Emit)**:

| 事件名 | 数据格式 | 说明 |
| :--- | :--- | :--- |
| `login` | `{ userId: 'u1', nickname: 'N' }` | 必填，连接后第一时间发送 |
| `join_room` | `'public'` (String) | 加入房间ID |
| `leave_room` | `'public'` (String) | 离开房间ID |
| `send_message` | `{ roomId: 'public', content: '...', messageType: 'text' }` | `content` 为文本或文件URL |

**接收 (On)**:

| 事件名 | 返回数据示例 | 说明 |
| :--- | :--- | :--- |
| `new_message` | `{ id: 1, content: '...', ... }` | 收到新消息，追加到列表底部 |
| `user_joined` | `{ roomId: '..', userId: '..' }` | 有人加入 |
| `user_left` | `{ roomId: '..', userId: '..' }` | 有人离开 |
| `login_success` | `{ userId: '..' }` | 登录成功回调 |
