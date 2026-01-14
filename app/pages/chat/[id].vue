<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 头部 -->
    <header class="bg-purple-600 text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <button 
            @click="goBack"
            class="mr-4 text-white hover:text-purple-200"
          >
            ←
          </button>
          <div>
            <h1 class="text-xl font-semibold">{{ roomName }}</h1>
            <p class="text-sm opacity-80">在线用户: {{ onlineCount }} | 房间 ID: {{ roomId }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm">{{ userInfo.nickname }}</p>
          <p class="text-xs opacity-70">{{ userInfo.userId }}</p>
        </div>
      </div>
    </header>

    <!-- 消息列表 -->
    <div class="container mx-auto px-4 py-6">
      <div 
        ref="messagesContainer"
        class="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-220px)] overflow-y-auto mb-4"
      >
        <div class="space-y-4">
          <!-- 系统消息 -->
          <div v-if="messages.length === 0" class="text-center py-8 text-gray-500">
            暂无消息，开始聊天吧！
          </div>

          <!-- 消息项 -->
          <div 
            v-for="message in messages" 
            :key="message.id"
            :class="['flex', message.userId === userInfo.userId ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="[
                'max-w-[70%] p-3 rounded-lg',
                message.userId === userInfo.userId 
                  ? 'bg-purple-500 text-white rounded-tr-none' 
                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
              ]"
            >
              <div class="font-medium mb-1 text-xs opacity-80">
                {{ message.nickname || message.userId }}
              </div>
              <div class="mb-1">{{ message.content }}</div>
              <div class="text-xs opacity-70 text-right">
                {{ formatTime(message.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 消息输入 -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-end">
          <input 
            v-model="messageInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="输入消息..."
            class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
          <button 
            @click="sendMessage"
            :disabled="!messageInput.trim()"
            class="ml-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io, Socket } from 'socket.io-client';

const router = useRouter();
const route = useRoute();
const socket = ref<Socket | null>(null);
const messages = ref([]);
const messageInput = ref('');
const onlineCount = ref(0);
const messagesContainer = ref(null);
const roomId = String(route.params.id);
const roomName = ref('私密聊天室');

// 用户信息
const userInfo = ref({
  userId: '',
  nickname: ''
});

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 返回首页
const goBack = () => {
  router.push('/');
};

// 加载历史消息
const loadHistoryMessages = async () => {
  try {
    const response = await fetch(`/api/chat/messages?roomId=${roomId}&limit=50`);
    const result = await response.json();
    
    if (result.success) {
      messages.value = result.data;
      await nextTick();
      scrollToBottom();
    }
  } catch (error) {
    console.error('加载历史消息失败:', error);
  }
};

// 发送消息
const sendMessage = () => {
  if (!messageInput.value.trim() || !socket.value) return;

  socket.value.emit('send_message', {
    roomId,
    content: messageInput.value.trim()
  });

  messageInput.value = '';
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 连接 WebSocket
const connectWebSocket = () => {
  socket.value = io('http://localhost:3001', {
    path: '/socket.io'
  });

  socket.value.on('connect', () => {
    console.log('WebSocket 连接成功');
    
    // 登录
    socket.value?.emit('login', {
      userId: userInfo.value.userId,
      nickname: userInfo.value.nickname
    });
  });

  socket.value.on('login_success', () => {
    console.log('登录成功');
    // 加入房间
    socket.value?.emit('join_room', roomId);
  });

  socket.value.on('room_joined', (data) => {
    console.log('加入房间成功:', data);
    onlineCount.value = data.onlineCount;
  });

  socket.value.on('new_message', (message) => {
    messages.value.push(message);
    scrollToBottom();
  });

  socket.value.on('user_joined', () => {
    // 可以在这里更新在线用户数
  });

  socket.value.on('user_left', () => {
    // 可以在这里更新在线用户数
  });

  socket.value.on('disconnect', () => {
    console.log('WebSocket 断开连接');
  });
};

// 生命周期
onMounted(() => {
  // 加载用户信息
  const savedUserInfo = localStorage.getItem('userInfo');
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo);
  } else {
    // 如果没有用户信息，返回首页
    router.push('/');
    return;
  }

  // 加载历史消息
  loadHistoryMessages();

  // 连接 WebSocket
  connectWebSocket();

  // 设置房间名称
  roomName.value = `私密聊天室 (${roomId.substring(0, 10)}...)`;
});

onUnmounted(() => {
  // 断开 WebSocket 连接
  if (socket.value) {
    socket.value.emit('leave_room', roomId);
    socket.value.disconnect();
  }
});
</script>
