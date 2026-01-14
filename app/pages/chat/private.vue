<template>
  <div class="h-screen bg-slate-50 flex flex-col overflow-hidden">
    <!-- 头部 -->
    <header class="flex-none bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg z-10">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="goBack"
            class="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 group"
            title="返回首页"
          >
            <span class="inline-block transform group-hover:-translate-x-1 transition-transform">←</span>
          </button>
          <div>
            <h1 class="text-xl font-bold tracking-wide">{{ roomName }}</h1>
            <div class="flex items-center gap-3 text-xs opacity-90">
              <span class="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span>在线: {{ onlineCount }}</span>
              </span>
              <button 
                @click="copyRoomId"
                class="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                title="点击复制房间 ID"
              >
                <span>ID</span>
                <span class="text-[10px]">📋</span>
              </button>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <div class="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-sm font-bold shadow-inner">
              {{ userInfo.nickname?.[0]?.toUpperCase() || 'U' }}
            </div>
            <div>
              <p class="text-sm font-medium leading-none mb-1">{{ userInfo.nickname }}</p>
              <p class="text-[10px] opacity-60 font-mono leading-none">{{ userInfo.userId.substring(0, 8) }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 消息列表 -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scroll-smooth"
    >
      <!-- 系统消息 -->
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-2xl">
          🤫
        </div>
        <p>私密对话，畅所欲言</p>
      </div>

      <!-- 消息项 -->
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['flex items-end gap-2 group', message.userId === userInfo.userId ? 'flex-row-reverse' : 'flex-row']"
      >
        <!-- 头像 -->
        <div 
          class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm"
          :class="message.userId === userInfo.userId ? 'bg-pink-500' : 'bg-slate-400'"
        >
          {{ (message.nickname || message.userId)[0]?.toUpperCase() }}
        </div>

        <div 
          :class="[
            'max-w-[70%] p-3 shadow-sm transition-all duration-200 hover:shadow-md relative',
            message.userId === userInfo.userId 
              ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl rounded-tr-none' 
              : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none'
          ]"
        >
          <div 
            v-if="message.userId !== userInfo.userId"
            class="font-medium mb-1 text-xs opacity-60 text-slate-500 pl-1"
          >
            {{ message.nickname || message.userId }}
          </div>
          <div class="text-sm leading-relaxed break-words">{{ message.content }}</div>
          <div 
            :class="[
              'text-[10px] mt-1 text-right',
              message.userId === userInfo.userId ? 'text-purple-100/70' : 'text-slate-400'
            ]"
          >
            {{ formatTime(message.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 消息输入 -->
    <div class="flex-none p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-20">
      <div class="container mx-auto max-w-4xl">
        <div class="flex items-end gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-400 transition-all duration-200">
          <input 
            v-model="messageInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="输入消息..."
            class="flex-1 bg-transparent border-none px-4 py-3 focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
          >
          <button 
            @click="sendMessage"
            :disabled="!messageInput.trim()"
            class="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg hover:from-purple-600 hover:to-pink-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center aspect-square"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
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
const config = useRuntimeConfig();
const socket = ref(null);
const messages = ref([]);
const messageInput = ref('');
const onlineCount = ref(0);
const messagesContainer = ref(null);
const roomId = ref('');
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
    const response = await fetch(`/api/chat/messages?roomId=${roomId.value}&limit=50`);
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
    roomId: roomId.value,
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
  // 自动适配连接地址
  let wsUrl = config.public.wsUrl;
  if (!wsUrl && import.meta.dev) {
    wsUrl = 'http://localhost:4000';
  }

  socket.value = io(wsUrl || undefined, {
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
    socket.value?.emit('join_room', roomId.value);
  });

  socket.value.on('room_joined', (data) => {
    // console.log('加入房间成功:', data);
    onlineCount.value = data.onlineCount;
  });

  socket.value.on('new_message', async (message) => {
    messages.value.push(message);
    await nextTick();
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

  // 从 sessionStorage 获取 roomId
  const savedRoomId = sessionStorage.getItem('privateRoomId');
  if (!savedRoomId) {
    alert('无效的房间信息，请重新进入');
    router.push('/');
    return;
  }
  roomId.value = savedRoomId;

  // 加载历史消息
  loadHistoryMessages();

  // 连接 WebSocket
  connectWebSocket();

  // 设置房间名称
  roomName.value = `私密聊天室`;
});

// 复制房间 ID
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId.value);
      alert('房间 ID 已复制到剪贴板: ' + roomId.value);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请重试');
    }
  };
  
  onUnmounted(() => {
    // 断开 WebSocket 连接
    if (socket.value) {
      socket.value.emit('leave_room', roomId.value);
      socket.value.disconnect();
    }
  });
</script>
