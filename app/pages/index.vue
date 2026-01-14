<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-8 md:p-12 transition-all duration-300 border border-white/20">
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">在线聊天</h1>
        <p class="text-slate-500 text-lg font-light">简单、私密、高效的实时通信工具</p>
      </div>

      <!-- 用户信息输入 -->
      <div class="mb-12 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 class="text-xl font-semibold text-slate-700 mb-6 flex items-center">
          <div class="w-8 h-8 bg-blue-500 rounded-lg text-white flex items-center justify-center mr-3 shadow-blue-200 shadow-lg">
            <span class="text-sm">👤</span>
          </div>
          用户信息
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="group">
            <label for="userId" class="block text-sm font-medium text-slate-600 mb-2 ml-1 group-focus-within:text-blue-500 transition-colors">自定义 ID</label>
            <div class="relative">
              <input 
                type="text" 
                id="userId" 
                v-model="userInfo.userId" 
                placeholder="设置您的唯一标识" 
                class="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                required
              >
            </div>
          </div>
          <div class="group">
            <label for="nickname" class="block text-sm font-medium text-slate-600 mb-2 ml-1 group-focus-within:text-blue-500 transition-colors">昵称</label>
            <div class="relative">
              <input 
                type="text" 
                id="nickname" 
                v-model="userInfo.nickname" 
                placeholder="展示给他人的名字" 
                class="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                required
              >
            </div>
          </div>
        </div>
        <button 
          @click="saveUserInfo" 
          class="mt-6 w-full bg-slate-800 text-white px-6 py-3.5 rounded-xl hover:bg-slate-700 hover:shadow-lg transition-all duration-200 transform active:scale-[0.99] font-medium flex items-center justify-center gap-2"
        >
          <span>保存信息</span>
        </button>
      </div>

      <!-- 聊天室选择 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- 公共聊天室 -->
        <div class="bg-gradient-to-br from-blue-50/50 to-blue-100/50 rounded-2xl p-8 border border-blue-100/50 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group">
          <h2 class="text-xl font-bold text-slate-800 mb-3 flex items-center">
            <div class="w-10 h-10 bg-blue-500 rounded-xl text-white flex items-center justify-center mr-3 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <span class="text-lg">🌐</span>
            </div>
            公共广场
          </h2>
          <p class="text-slate-500 mb-8 leading-relaxed">所有人都可以自由加入的公共讨论空间，畅所欲言。</p>
          <button 
            @click="joinPublicChat" 
            class="w-full bg-blue-500 text-white px-6 py-3.5 rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 transform active:scale-[0.99] font-medium"
            :disabled="!isUserInfoComplete"
          >
            进入广场
          </button>
        </div>

        <!-- 私密聊天室 -->
        <div class="bg-gradient-to-br from-purple-50/50 to-purple-100/50 rounded-2xl p-8 border border-purple-100/50 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300 group">
          <h2 class="text-xl font-bold text-slate-800 mb-3 flex items-center">
            <div class="w-10 h-10 bg-purple-500 rounded-xl text-white flex items-center justify-center mr-3 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
              <span class="text-lg">🔒</span>
            </div>
            私密空间
          </h2>
          <p class="text-slate-500 mb-6 leading-relaxed">创建或加入私密房间，仅通过 ID 邀请好友。</p>
          
          <div class="mb-6">
            <input 
              type="text" 
              id="roomId" 
              v-model="joinRoomId" 
              placeholder="输入房间 ID 加入..." 
              class="w-full px-4 py-3 bg-white/60 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            >
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="createPrivateChat" 
              class="bg-purple-500 text-white px-4 py-3 rounded-xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 transform active:scale-[0.99] font-medium"
              :disabled="!isUserInfoComplete"
            >
              新建房间
            </button>
            <button 
              @click="joinPrivateChat" 
              class="bg-white text-purple-600 border border-purple-100 px-4 py-3 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 transform active:scale-[0.99] font-medium"
              :disabled="!isUserInfoComplete || !joinRoomId"
            >
              加入房间
            </button>
          </div>
        </div>
      </div>

      <!-- 房间列表 -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-slate-700 mb-6 flex items-center pl-1">
          <span class="text-lg mr-2">📋</span>
          最近访问
        </h2>
        <div class="space-y-3">
          <div 
            v-for="room in recentRooms" 
            :key="room.id"
            class="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all duration-200"
          >
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex items-center gap-2 mb-1">
                <span class="w-2 h-2 rounded-full bg-green-400"></span>
                <p class="font-bold text-slate-700 truncate">{{ room.name }}</p>
              </div>
              <button 
                @click="copyRoomId(room.id)" 
                class="text-xs text-slate-400 hover:text-blue-500 font-mono flex items-center gap-1.5 transition-colors duration-200 bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded-md w-fit"
                title="点击复制房间ID"
              >
                <span>ID: {{ room.id.substring(0, 8) }}...</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">📋</span>
              </button>
            </div>
            <div class="flex gap-3 opacity-90">
              <button 
                @click="joinRoom(room.id)"
                class="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium"
              >
                加入
              </button>
              <button 
                @click="deleteRoom(room)"
                class="text-sm text-slate-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                title="删除记录"
              >
                <span class="text-lg">×</span>
              </button>
            </div>
          </div>
          <div v-if="recentRooms.length === 0" class="text-center text-slate-400 py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            暂无最近的聊天记录
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 用户信息
const userInfo = ref({
  userId: '',
  nickname: ''
});

// 加入房间 ID
const joinRoomId = ref('');

// 最近的房间
const recentRooms = ref([]);

// 计算属性：用户信息是否完整
const isUserInfoComplete = computed(() => {
  return userInfo.value.userId && userInfo.value.nickname;
});

// 加载本地存储的用户信息
onMounted(() => {
  const savedUserInfo = localStorage.getItem('userInfo');
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo);
  }

  const savedRooms = localStorage.getItem('recentRooms');
  if (savedRooms) {
    recentRooms.value = JSON.parse(savedRooms);
  }
});

// 保存用户信息
const saveUserInfo = () => {
  if (isUserInfoComplete.value) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
    alert('用户信息保存成功！');
  } else {
    alert('请填写完整的用户信息');
  }
};

// 复制房间 ID
const copyRoomId = async (id) => {
  try {
    const cleanId = id.trim();
    await navigator.clipboard.writeText(cleanId);
    // 可以考虑用更友好的提示组件，这里先用 alert 保持一致性，或者只在控制台输出避免打扰，
    // 但为了反馈，短暂更改按钮文字可能更好，不过最简单是 alert
    alert('房间 ID 已复制到剪贴板: ' + cleanId);
  } catch (err) {
    console.error('复制失败:', err);
    alert('复制失败，请重试');
  }
};

// 加入公共聊天室
const joinPublicChat = () => {
  if (!isUserInfoComplete.value) {
    alert('请填写完整的用户信息');
    return;
  }

  // 保存用户信息
  localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  
  // 跳转到公共聊天室
  router.push('/chat');
};

// 创建私密聊天室
const createPrivateChat = async () => {
  if (!isUserInfoComplete.value) {
    alert('请填写完整的用户信息');
    return;
  }

  try {
    // 生成房间名称
    const roomName = `${userInfo.value.nickname}的聊天室`;
    
    // 调用 API 创建房间
    const response = await fetch('/api/chat/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: roomName,
        createdBy: userInfo.value.userId
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // 保存到最近房间
      const newRoom = {
        id: result.data.roomId,
        name: result.data.name,
        createdBy: userInfo.value.userId // 保存创建者 ID
      };
      
      const updatedRooms = [newRoom, ...recentRooms.value.filter(r => r.id !== newRoom.id)].slice(0, 5);
      recentRooms.value = updatedRooms;
      localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));
      
      // 保存房间 ID 到 sessionStorage 并跳转
      sessionStorage.setItem('privateRoomId', result.data.roomId);
      router.push('/chat/private');
    } else {
      alert('创建聊天室失败：' + result.message);
    }
  } catch (error) {
    console.error('创建聊天室失败:', error);
    alert('创建聊天室失败，请稍后重试');
  }
};

// 加入私密聊天室
const joinPrivateChat = async () => {
  if (!isUserInfoComplete.value) {
    alert('请填写完整的用户信息');
    return;
  }

  const trimmedRoomId = joinRoomId.value.trim();

  if (!trimmedRoomId) {
    alert('请输入房间 ID');
    return;
  }

  try {
    // 获取房间信息
    const response = await fetch(`/api/chat/room?roomId=${trimmedRoomId}`);
    const result = await response.json();

    if (result.success) {
      // 保存到最近房间
      const newRoom = {
        id: result.data.roomId,
        name: result.data.name,
        createdBy: result.data.createdBy
      };

      const updatedRooms = [newRoom, ...recentRooms.value.filter(r => r.id !== newRoom.id)].slice(0, 5);
      recentRooms.value = updatedRooms;
      localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));

      // 保存用户信息
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
      
      // 保存房间 ID 到 sessionStorage 并跳转
      sessionStorage.setItem('privateRoomId', trimmedRoomId);
      router.push('/chat/private');
    } else {
      alert('加入房间失败：' + (result.message || '房间不存在'));
    }
  } catch (error) {
    console.error('加入房间失败:', error);
    alert('加入房间失败，请稍后重试');
  }
};

// 加入指定房间
const joinRoom = async (roomId) => {
  if (!isUserInfoComplete.value) {
    alert('请填写完整的用户信息');
    return;
  }

  // 保存用户信息
  localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  
  // 保存房间 ID 到 sessionStorage 并跳转
  sessionStorage.setItem('privateRoomId', roomId.trim());
  router.push('/chat/private');
};

// 删除最近的房间
const deleteRoom = async (room) => {
  const isOwner = room.createdBy === userInfo.value.userId;
  let deleteFromServer = false;

  if (isOwner) {
    const choice = confirm('你是这个房间的创建者。\n点击"确定"将永久删除该房间和所有消息。\n点击"取消"仅从列表中移除。');
    deleteFromServer = choice;
  } else {
    if (!confirm('确定要从列表中删除这个聊天室吗？')) return;
  }
  
  if (deleteFromServer) {
    try {
      const response = await fetch('/api/chat/room', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: room.id,
          userId: userInfo.value.userId
        })
      });
      const result = await response.json();
      if (!result.success) {
        alert('删除房间失败: ' + result.message);
        return; // 如果服务端删除失败，可能不应该删除本地记录？或者提示用户
      }
      alert('房间已永久删除');
    } catch (error) {
      console.error('删除房间失败:', error);
      alert('删除房间出错');
      return;
    }
  }

  const updatedRooms = recentRooms.value.filter(r => r.id !== room.id);
  recentRooms.value = updatedRooms;
  localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));
};
</script>
