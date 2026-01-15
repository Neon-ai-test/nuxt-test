<template>
  <div class="min-h-screen bg-[#F5F5F7] font-sans selection:bg-blue-500/30 py-12 px-6">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <button @click="router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 class="text-3xl font-bold text-[#1D1D1F]">账户中心</h1>
      </div>

      <div class="space-y-6">
        <!-- Basic Info Card -->
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold text-[#1D1D1F] mb-6 flex items-center gap-2">
            <span>👤</span> 基本信息
          </h2>
          
          <div class="space-y-6">
            <div class="group">
              <label class="block text-sm font-medium text-[#86868B] mb-2 ml-1">昵称</label>
              <input 
                type="text" 
                v-model="userInfo.nickname" 
                readonly
                class="w-full bg-[#F5F5F7] border-2 border-transparent rounded-2xl px-5 py-4 text-lg font-medium text-[#1D1D1F] outline-none cursor-not-allowed opacity-75"
              >
              <p class="text-xs text-gray-400 mt-2 ml-1">如需修改昵称，请返回首页编辑</p>
            </div>
            
            <div class="group">
              <label class="block text-sm font-medium text-[#86868B] mb-2 ml-1">用户 ID</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="userInfo.userId" 
                  readonly
                  class="w-full bg-[#F5F5F7] border-2 border-transparent rounded-2xl px-5 py-4 text-lg font-mono text-[#1D1D1F] outline-none cursor-not-allowed opacity-75"
                >
                <span class="absolute right-5 top-1/2 -translate-y-1/2 text-[#86868B] font-bold">#</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Card -->
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold text-[#1D1D1F] mb-6 flex items-center gap-2">
            <span>🔒</span> 安全设置
          </h2>

          <div v-if="loadingStatus" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <div v-else class="space-y-6">
            <!-- Set/Change Password -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 class="font-medium text-gray-900">登录密码</h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ hasPassword ? '已设置密码，可用于账户保护' : '未设置密码，建议立即设置' }}
                </p>
              </div>
              <button 
                @click="showPasswordModal = true"
                class="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {{ hasPassword ? '修改密码' : '设置密码' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-red-100 overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-red-500/20"></div>
          <h2 class="text-xl font-semibold text-red-600 mb-6 flex items-center gap-2">
            <span>⚠️</span> 危险区域
          </h2>
          
          <div class="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
            <div>
              <h3 class="font-medium text-red-900">注销账户</h3>
              <p class="text-sm text-red-600/80 mt-1">
                永久删除账户及所有相关数据，此操作不可恢复
              </p>
            </div>
            <button 
              @click="handleDeleteClick"
              class="px-4 py-2 bg-red-600 text-white shadow-md shadow-red-500/20 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors active:scale-95"
            >
              注销账户
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
        <h3 class="text-xl font-bold text-gray-900 mb-6">
          {{ hasPassword ? '修改密码' : '设置密码' }}
        </h3>

        <form @submit.prevent="handleSavePassword" class="space-y-4">
          <div v-if="hasPassword">
            <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
            <input v-model="passwordForm.oldPassword" type="password" required class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input v-model="passwordForm.newPassword" type="password" required minlength="6" class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="至少6位字符">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
            <input v-model="passwordForm.confirmPassword" type="password" required minlength="6" class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="再次输入密码">
          </div>

          <div v-if="passwordError" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ passwordError }}
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <button type="button" @click="showPasswordModal = false" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">取消</button>
            <button type="submit" :disabled="isSavingPassword" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center">
              <svg v-if="isSavingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSavingPassword ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border-2 border-red-100 transform transition-all scale-100">
        <div class="flex items-center gap-3 text-red-600 mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-xl font-bold">确认注销账户</h3>
        </div>
        
        <p class="text-gray-600 mb-6 leading-relaxed">
          请输入您的登录密码以确认身份。注销后，您的所有数据将被永久删除且无法恢复。
        </p>

        <form @submit.prevent="handleDeleteAccount" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">登录密码</label>
            <input v-model="deletePassword" type="password" required class="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="请输入密码">
          </div>

          <div v-if="deleteError" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ deleteError }}
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <button type="button" @click="showDeleteModal = false" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">取消</button>
            <button type="submit" :disabled="isDeleting" class="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center">
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isDeleting ? '验证并注销' : '确认注销' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfo = ref({ userId: '', nickname: '' });
const hasPassword = ref(false);
const loadingStatus = ref(true);

// Password Modal State
const showPasswordModal = ref(false);
const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const isSavingPassword = ref(false);
const passwordError = ref('');

// Delete Modal State
const showDeleteModal = ref(false);
const deletePassword = ref('');
const isDeleting = ref(false);
const deleteError = ref('');

onMounted(async () => {
  const savedUserInfo = localStorage.getItem('userInfo');
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo);
    await checkUserStatus();
  } else {
    router.push('/');
  }
});

const checkUserStatus = async () => {
  if (!userInfo.value.userId) return;
  
  try {
    const res = await $fetch('/api/user/status', {
      params: { userId: userInfo.value.userId }
    });
    hasPassword.value = res.hasPassword;
  } catch (error) {
    console.error('Check status failed', error);
  } finally {
    loadingStatus.value = false;
  }
};

const handleSavePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '两次输入的密码不一致';
    return;
  }
  
  isSavingPassword.value = true;
  passwordError.value = '';

  try {
    await $fetch('/api/user/password', {
      method: 'POST',
      body: {
        userId: userInfo.value.userId,
        nickname: userInfo.value.nickname,
        oldPassword: hasPassword.value ? passwordForm.value.oldPassword : undefined,
        newPassword: passwordForm.value.newPassword
      }
    });
    
    alert('密码设置成功');
    showPasswordModal.value = false;
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
    hasPassword.value = true;
  } catch (error) {
    passwordError.value = error.data?.message || '设置失败';
  } finally {
    isSavingPassword.value = false;
  }
};

const handleDeleteClick = () => {
  if (!hasPassword.value) {
    alert('为了您的账户安全，注销前请先设置密码');
    showPasswordModal.value = true;
    return;
  }
  showDeleteModal.value = true;
};

const handleDeleteAccount = async () => {
  isDeleting.value = true;
  deleteError.value = '';

  try {
    await $fetch('/api/user/account', {
      method: 'DELETE',
      body: {
        userId: userInfo.value.userId,
        password: deletePassword.value
      }
    });
    
    // Clear local storage
    localStorage.removeItem('userInfo');
    localStorage.removeItem('recentRooms');
    localStorage.removeItem('chat_muted');
    
    alert('账户已注销');
    router.push('/');
  } catch (error) {
    deleteError.value = error.data?.message || '注销失败';
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
