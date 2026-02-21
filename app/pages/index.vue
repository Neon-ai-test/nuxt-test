<template>
  <div class="min-h-screen bg-[#F5F5F7] font-sans selection:bg-blue-500/30">
    <!-- 顶部导航/标题栏 -->
    <!-- <nav class="sticky top-0 z-50 bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-gray-200/50">
      <div class="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <h1 class="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
          NuxtChat
        </h1>
        <div class="flex items-center gap-4">
          <div class="text-sm font-medium text-[#86868B]">
            {{ userInfo.nickname || '未登录' }}
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-inner flex items-center justify-center text-white font-bold text-lg">
            {{ userInfo.nickname ? userInfo.nickname[0] : '?' }}
          </div>
        </div>
      </div>
    </nav> -->

    <main class="max-w-[1200px] mx-auto px-6 py-12 pb-24">
      
      <!-- 欢迎语 -->
      <!-- <div class="mb-16 text-center md:text-left animate-fade-in-up">
        <h2 class="text-5xl md:text-7xl font-semibold text-[#1D1D1F] tracking-tight mb-4 leading-tight">
          连接，<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            无处不在。
          </span>
        </h2>
        <p class="text-xl md:text-2xl text-[#86868B] font-medium max-w-2xl">
          体验极致流畅的实时沟通，简单、纯粹、优雅。
        </p>
      </div> -->

      <!-- Bento Grid 布局 -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <!-- 卡片 1: 个人档案 (跨 4 列) -->
        <div class="md:col-span-5 lg:col-span-4 flex flex-col gap-8">
          <div class="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] transition-shadow duration-500 border border-gray-100 h-full flex flex-col">
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-2xl">
                  🆔
                </div>
                <h3 class="text-2xl font-semibold text-[#1D1D1F]">我的名片</h3>
              </div>
              <button 
                @click="router.push('/user')"
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                title="账户设置"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>

            <div class="flex-1 space-y-6">
              <div class="group">
                <label class="block text-sm font-medium text-[#86868B] mb-2 ml-1 transition-colors group-focus-within:text-blue-600">昵称</label>
                <input 
                  type="text" 
                  v-model="userInfo.nickname" 
                  placeholder="你的名字" 
                  class="w-full bg-[#F5F5F7] hover:bg-[#E8E8ED] focus:bg-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-lg font-medium text-[#1D1D1F] placeholder-[#86868B]/50 outline-none transition-all duration-300"
                >
              </div>
              
              <div class="group">
                <label class="block text-sm font-medium text-[#86868B] mb-2 ml-1 transition-colors group-focus-within:text-blue-600">用户 ID</label>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="userInfo.userId" 
                    placeholder="唯一标识" 
                    class="w-full bg-[#F5F5F7] hover:bg-[#E8E8ED] focus:bg-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-lg font-mono text-[#1D1D1F] placeholder-[#86868B]/50 outline-none transition-all duration-300"
                  >
                  <span class="absolute right-5 top-1/2 -translate-y-1/2 text-[#86868B] font-bold">#</span>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-100">
              <button 
                @click="saveUserInfo"
                class="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white text-lg font-medium py-4 rounded-full transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/20"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>

        <!-- 卡片 2: 核心功能入口 (跨 8 列) -->
        <div class="md:col-span-7 lg:col-span-8 flex flex-col gap-8">
          
          <!-- 公共广场 (Hero Card) -->
          <div 
            @click="joinPublicChat"
            class="group relative bg-black rounded-[2rem] p-10 overflow-hidden cursor-pointer h-[320px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-[1.01]"
            :class="{'opacity-80 grayscale pointer-events-none': !isUserInfoComplete}"
          >
            <!-- 动态背景 -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-900 opacity-90"></div>
            <div class="absolute -right-20 -top-20 w-96 h-96 bg-blue-400 rounded-full blur-[100px] mix-blend-overlay opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
            <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-400 rounded-full blur-[80px] mix-blend-overlay opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>

            <div class="relative z-10 h-full flex flex-col justify-between">
              <div class="flex justify-between items-start">
                <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                  🌍
                </div>
                <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>

              <div>
                <h3 class="text-4xl font-bold text-white mb-3 tracking-tight">公共广场</h3>
                <p class="text-blue-100 text-lg font-medium max-w-md">
                  加入全球对话。在这里，每一个声音都值得被听见。
                </p>
              </div>
            </div>
          </div>

          <!-- 私密空间 & 最近访问 (Grid within Grid) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            
            <!-- 私密房间 -->
            <div class="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] transition-shadow duration-500 border border-gray-100 flex flex-col justify-between min-h-[300px]">
              <div>
                <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl text-purple-600 mb-6">
                  🔒
                </div>
                <h3 class="text-2xl font-semibold text-[#1D1D1F] mb-2">私密空间</h3>
                <p class="text-[#86868B] font-medium">创建专属频道，邀请好友加密畅聊。</p>
              </div>

              <div class="mt-8 space-y-4">
                <div class="flex gap-3">
                  <input 
                    type="text" 
                    v-model="joinRoomId"
                    placeholder="输入房间号..." 
                    class="flex-1 bg-[#F5F5F7] border-none rounded-xl px-4 py-3.5 text-[#1D1D1F] placeholder-[#86868B]/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                  >
                  <button 
                    @click="joinPrivateChat"
                    :disabled="!isUserInfoComplete || !joinRoomId"
                    class="bg-[#1D1D1F] text-white px-6 rounded-xl font-medium hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    加入
                  </button>
                </div>
                <button 
                  @click="createPrivateChat"
                  :disabled="!isUserInfoComplete"
                  class="w-full py-3.5 border border-dashed border-purple-200 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span class="text-xl">+</span> 创建新房间
                </button>
              </div>
            </div>

            <!-- 最近访问 -->
            <div class="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] flex flex-col min-h-[300px]">
              <h3 class="text-sm font-bold text-[#86868B] uppercase tracking-wider mb-6 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                最近访问
              </h3>

              <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div v-if="recentRooms.length === 0" class="h-full flex flex-col items-center justify-center text-[#86868B]/60 gap-4">
                  <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl grayscale opacity-50">
                    📫
                  </div>
                  <p class="font-medium">暂无记录</p>
                </div>

                <TransitionGroup name="list" tag="div" class="space-y-3" v-else>
                  <div 
                    v-for="room in recentRooms" 
                    :key="room.id"
                    class="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200/50 hover:shadow-md transition-all cursor-pointer"
                    @click="joinRoom(room.id)"
                  >
                    <div class="flex items-center gap-4 min-w-0">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-[#1D1D1F] font-bold shrink-0">
                        {{ room.name[0] }}
                      </div>
                      <div class="min-w-0">
                        <h4 class="font-semibold text-[#1D1D1F] truncate">{{ room.name }}</h4>
                        <p class="text-xs text-[#86868B] font-mono mt-0.5 truncate">ID: {{ room.id.substring(0, 8) }}...</p>
                      </div>
                    </div>
                    
                    <button 
                      @click.stop="deleteRoom(room)"
                      class="w-8 h-8 flex items-center justify-center text-[#86868B] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="删除"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </TransitionGroup>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
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
    // 使用更轻量的提示，或者干脆不提示，这里为了反馈保留
    // alert('用户信息保存成功！');
    // 可以添加一个临时状态来显示“已保存”
  } else {
    alert('请填写完整的用户信息');
  }
};

// 复制房间 ID
const copyRoomId = async (id) => {
  try {
    const cleanId = id.trim();
    await navigator.clipboard.writeText(cleanId);
    alert('已复制: ' + cleanId);
  } catch (err) {
    console.error('复制失败:', err);
  }
};

// 加入公共聊天室
const joinPublicChat = () => {
  if (!isUserInfoComplete.value) {
    alert('请先设置您的昵称和ID');
    return;
  }

  localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  router.push('/chat');
};

// 创建私密聊天室
const createPrivateChat = async () => {
  if (!isUserInfoComplete.value) {
    alert('请先设置您的昵称和ID');
    return;
  }

  try {
    const roomName = `${userInfo.value.nickname}的聊天室`;
    
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
      const newRoom = {
        id: result.data.roomId,
        name: result.data.name,
        createdBy: userInfo.value.userId
      };
      
      const updatedRooms = [newRoom, ...recentRooms.value.filter(r => r.id !== newRoom.id)].slice(0, 5);
      recentRooms.value = updatedRooms;
      localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
      sessionStorage.setItem('privateRoomId', result.data.roomId);
      router.push('/chat/private');
    } else {
      alert('创建失败：' + result.message);
    }
  } catch (error) {
    console.error('创建失败:', error);
    alert('创建失败，请稍后重试');
  }
};

// 加入私密聊天室
const joinPrivateChat = async () => {
  if (!isUserInfoComplete.value) {
    alert('请先设置您的昵称和ID');
    return;
  }

  const trimmedRoomId = joinRoomId.value.trim();

  if (!trimmedRoomId) {
    return;
  }

  try {
    const response = await fetch(`/api/chat/room?roomId=${trimmedRoomId}`);
    const result = await response.json();

    if (result.success) {
      const newRoom = {
        id: result.data.roomId,
        name: result.data.name,
        createdBy: result.data.createdBy
      };

      const updatedRooms = [newRoom, ...recentRooms.value.filter(r => r.id !== newRoom.id)].slice(0, 5);
      recentRooms.value = updatedRooms;
      localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));

      localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
      
      sessionStorage.setItem('privateRoomId', trimmedRoomId);
      router.push('/chat/private');
    } else {
      alert('加入失败：' + (result.message || '房间不存在'));
    }
  } catch (error) {
    console.error('加入失败:', error);
    alert('加入失败，请稍后重试');
  }
};

// 加入指定房间
const joinRoom = async (roomId) => {
  if (!isUserInfoComplete.value) {
    alert('请先设置您的昵称和ID');
    return;
  }

  localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  sessionStorage.setItem('privateRoomId', roomId.trim());
  router.push('/chat/private');
};

// 删除最近的房间
const deleteRoom = async (room) => {
  const isOwner = room.createdBy === userInfo.value.userId;
  let deleteFromServer = false;

  if (isOwner) {
    const choice = confirm('确定要永久删除该房间吗？此操作不可恢复。');
    deleteFromServer = choice;
    if (!choice) {
         // 如果不永久删除，询问是否仅移除记录
         if (!confirm('仅从列表中移除？')) return;
    }
  } else {
    if (!confirm('确定要移除此记录吗？')) return;
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
        alert('删除失败: ' + result.message);
        return;
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('出错');
      return;
    }
  }

  const updatedRooms = recentRooms.value.filter(r => r.id !== room.id);
  recentRooms.value = updatedRooms;
  localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));
};
</script>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
