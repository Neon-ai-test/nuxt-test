<template>
  <!-- Loading Status -->
  <div v-if="checkingStatus" class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>

  <!-- Register Screen (First Run) -->
  <div v-else-if="isInitialized === false && !isAuthenticated" class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-300 transform hover:scale-[1.01]">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 ring-8 ring-blue-50/50">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">初始化管理员</h1>
        <p class="text-gray-500 mt-2 text-sm">初次使用请设置管理员密码</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设置密码</label>
          <input 
            v-model="registerForm.password" 
            type="password" 
            required
            minlength="6"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
            placeholder="至少6位字符"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            required
            minlength="6"
            class="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
            placeholder="再次输入密码"
          >
        </div>
        
        <div v-if="registerError" class="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100 animate-pulse">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {{ registerError }}
        </div>

        <button 
          type="submit" 
          :disabled="isRegistering"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        >
          <svg v-if="isRegistering" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isRegistering ? '设置中...' : '完成设置' }}
        </button>
      </form>
    </div>
  </div>

  <!-- Login Screen -->
  <div v-else-if="!isAuthenticated" class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-300 transform hover:scale-[1.01]">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 ring-8 ring-blue-50/50">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">管理员登录</h1>
        <p class="text-gray-500 mt-2 text-sm">请输入管理员密码以访问后台系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">管理员密码</label>
          <div class="relative">
            <input 
              id="password"
              v-model="passwordInput" 
              type="password" 
              required
              class="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
              placeholder="••••••••"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
               <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
          </div>
        </div>
        
        <div v-if="loginError" class="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100 animate-pulse">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {{ loginError }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoggingIn"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
        >
          <svg v-if="isLoggingIn" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isLoggingIn ? '验证中...' : '进入后台' }}
        </button>
      </form>
    </div>
  </div>

  <!-- Admin Dashboard -->
  <div v-else class="flex h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden relative">
    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
       <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
          <div class="flex justify-between items-center mb-6">
             <h3 class="text-xl font-bold text-gray-900">修改管理员密码</h3>
             <button @click="showChangePassword = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          
          <form @submit.prevent="handleChangePassword" class="space-y-4">
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                <input v-model="changePasswordForm.oldPassword" type="password" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
             </div>
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input v-model="changePasswordForm.newPassword" type="password" required minlength="6" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
             </div>
             <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                <input v-model="changePasswordForm.confirmPassword" type="password" required minlength="6" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
             </div>

             <div v-if="changePasswordError" class="text-red-600 text-sm p-2 bg-red-50 rounded">{{ changePasswordError }}</div>
             <div v-if="changePasswordSuccess" class="text-green-600 text-sm p-2 bg-green-50 rounded">{{ changePasswordSuccess }}</div>

             <div class="flex justify-end gap-3 mt-6">
                <button type="button" @click="showChangePassword = false" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">取消</button>
                <button type="submit" :disabled="isChangingPassword" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center">
                   <svg v-if="isChangingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   {{ isChangingPassword ? '保存中...' : '保存修改' }}
                </button>
             </div>
          </form>
       </div>
    </div>

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-lg shrink-0 transition-all duration-300">
      <!-- Logo / Title -->
      <div class="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div class="flex items-center gap-3">
           <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
           <span class="text-lg font-bold tracking-wide">管理后台</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-6 space-y-1">
        <button
          @click="currentTab = 'users'"
          :class="['w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200', currentTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800']"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span>用户管理</span>
        </button>
        <button
          @click="currentTab = 'chats'"
          :class="['w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200', currentTab === 'chats' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800']"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          <span>聊天记录</span>
        </button>
      </nav>

      <!-- Footer / User Info -->
      <div class="p-4 border-t border-slate-800 bg-slate-900/50">
        <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                AD
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-white">管理员</span>
                <span class="text-xs text-slate-500">System Admin</span>
              </div>
              <button @click="isAuthenticated = false" class="ml-auto text-slate-500 hover:text-white" title="退出登录">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
            <button @click="showChangePassword = true" class="w-full text-xs text-center py-1.5 border border-slate-700 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                修改密码
            </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 bg-gray-50">
      <!-- Top Header -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
        <h1 class="text-xl font-bold text-gray-800 tracking-tight">{{ currentTab === 'users' ? '用户管理' : '聊天记录' }}</h1>
        <div class="text-sm text-gray-500">
            {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) }}
        </div>
      </header>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-auto p-8">
        
        <!-- Users Tab -->
        <div v-if="currentTab === 'users'" class="space-y-6">
          <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div class="flex items-center gap-2">
                  <h2 class="text-lg font-semibold text-gray-900">用户列表</h2>
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">{{ totalUsers }} 位用户</span>
              </div>
              <div class="relative w-full sm:w-72">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                  v-model="userSearch" 
                  @input="debouncedFetchUsers"
                  type="text" 
                  placeholder="搜索用户ID或昵称..." 
                  class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-200"
                >
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50/50">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">用户信息</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">用户标识 (UID)</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">注册时间</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-if="loadingUsers">
                    <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
                        <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        加载中...
                    </td>
                  </tr>
                  <tr v-else-if="users.length === 0">
                    <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">暂无用户数据</td>
                  </tr>
                  <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50/30 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">#{{ user.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                          {{ user.nickname?.[0]?.toUpperCase() }}
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-semibold text-gray-900">{{ user.nickname }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                         <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                            {{ user.user_id }}
                         </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div class="bg-gray-50/50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
               <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-500">
                      显示第 <span class="font-medium text-gray-900">{{ (userPage - 1) * 20 + 1 }}</span> 到 <span class="font-medium text-gray-900">{{ Math.min(userPage * 20, totalUsers) }}</span> 条，共 <span class="font-medium text-gray-900">{{ totalUsers }}</span> 条
                    </p>
                  </div>
                  <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button @click="userPage > 1 && (userPage--, fetchUsers())" :disabled="userPage === 1" class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        上一页
                      </button>
                      <button @click="userPage * 20 < totalUsers && (userPage++, fetchUsers())" :disabled="userPage * 20 >= totalUsers" class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        下一页
                      </button>
                    </nav>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Chat Logs Tab -->
        <div v-if="currentTab === 'chats'" class="space-y-6">
          <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <!-- Filters -->
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>消息筛选</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">{{ totalMessages }} 条记录</span>
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">房间类型</label>
                  <select v-model="messageFilters.roomType" @change="fetchMessages(true)" class="block w-full pl-3 pr-10 py-2 text-sm border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg bg-gray-50 transition-all">
                    <option value="">全部房间</option>
                    <option value="public">公共广场</option>
                    <option value="private">私聊房间</option>
                  </select>
                </div>
                <div>
                   <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">房间 ID (精确匹配)</label>
                   <input v-model="messageFilters.roomId" @input="debouncedFetchMessages" type="text" class="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="输入房间 ID">
                </div>
                <div>
                   <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">用户 ID (精确匹配)</label>
                   <input v-model="messageFilters.userId" @input="debouncedFetchMessages" type="text" class="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="输入用户 ID">
                </div>
                <div class="flex items-end">
                  <button @click="resetMessageFilters" class="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    重置筛选
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50/50">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">时间</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">房间</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">用户</th>
                    <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">消息内容</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-if="loadingMessages">
                    <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
                        <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        加载消息中...
                    </td>
                  </tr>
                  <tr v-else-if="messages.length === 0">
                    <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">暂无符合条件的消息记录</td>
                  </tr>
                  <tr v-for="msg in messages" :key="msg.id" class="hover:bg-blue-50/30 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                      {{ formatDate(msg.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       <span :class="['px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border', msg.room_id === 'public' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-purple-50 text-purple-700 border-purple-100']">
                         {{ msg.room_id === 'public' ? '公共广场' : '私聊房间' }}
                       </span>
                       <div v-if="msg.room_id !== 'public'" class="text-xs text-gray-400 font-mono mt-1.5 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                          {{ msg.room_id.substring(0,8) }}...
                       </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                          <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold mr-2">
                              {{ msg.nickname?.[0]?.toUpperCase() || '?' }}
                          </div>
                          <div>
                              <div class="text-sm font-medium text-gray-900">{{ msg.nickname || '未知用户' }}</div>
                              <div class="text-xs text-gray-400 font-mono">{{ msg.user_id.substring(0,8) }}...</div>
                          </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 break-all max-w-lg">
                      <div v-if="msg.message_type === 'text'" class="bg-gray-50 px-3 py-2 rounded-lg inline-block border border-gray-100 text-gray-700">
                          {{ msg.content }}
                      </div>
                      <div v-else class="flex items-center gap-2 text-blue-600">
                        <span class="uppercase text-xs font-bold border border-blue-200 bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">{{ msg.message_type }}</span>
                        <a :href="msg.content" target="_blank" class="hover:underline hover:text-blue-800 truncate text-xs flex items-center gap-1">
                            {{ msg.content }}
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
             <!-- Pagination -->
            <div class="bg-gray-50/50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
               <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-500">
                      显示第 <span class="font-medium text-gray-900">{{ (messagePage - 1) * 20 + 1 }}</span> 到 <span class="font-medium text-gray-900">{{ Math.min(messagePage * 20, totalMessages) }}</span> 条，共 <span class="font-medium text-gray-900">{{ totalMessages }}</span> 条
                    </p>
                  </div>
                  <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button @click="messagePage > 1 && (messagePage--, fetchMessages())" :disabled="messagePage === 1" class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        上一页
                      </button>
                      <button @click="messagePage * 20 < totalMessages && (messagePage++, fetchMessages())" :disabled="messagePage * 20 >= totalMessages" class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        下一页
                      </button>
                    </nav>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// --- Auth Logic ---
const isAuthenticated = useState('admin-auth', () => false);
const passwordInput = ref('');
const isLoggingIn = ref(false);
const loginError = ref('');

const handleLogin = async () => {
  if (!passwordInput.value) return;
  
  isLoggingIn.value = true;
  loginError.value = '';
  
  try {
    const res = await $fetch('/api/admin/auth', {
      method: 'POST',
      body: { password: passwordInput.value }
    });
    
    if (res.success) {
      isAuthenticated.value = true;
      // Fetch initial data after login
      setTimeout(() => {
        fetchUsers();
        fetchMessages();
      }, 100);
    }
  } catch (err) {
    loginError.value = err.data?.message || '登录失败，请重试';
  } finally {
    isLoggingIn.value = false;
  }
};

// --- Status Check & Init Logic ---
const isInitialized = ref(null); // null = unknown, false = need register, true = need login
const checkingStatus = ref(true);
const registerForm = ref({ password: '', confirmPassword: '' });
const isRegistering = ref(false);
const registerError = ref('');

const checkStatus = async () => {
  checkingStatus.value = true;
  try {
    const { initialized } = await $fetch('/api/admin/status');
    isInitialized.value = initialized;
  } catch (e) {
    console.error('Failed to check status', e);
  } finally {
    checkingStatus.value = false;
  }
};

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerError.value = '两次输入的密码不一致';
    return;
  }
  if (registerForm.value.password.length < 6) {
    registerError.value = '密码长度至少需6位';
    return;
  }

  isRegistering.value = true;
  registerError.value = '';

  try {
    const res = await $fetch('/api/admin/init', {
      method: 'POST',
      body: { password: registerForm.value.password }
    });
    
    if (res.success) {
      alert('管理员密码设置成功，请登录');
      isInitialized.value = true;
      registerForm.value = { password: '', confirmPassword: '' };
    }
  } catch (err) {
    registerError.value = err.data?.message || '设置失败';
  } finally {
    isRegistering.value = false;
  }
};

// --- Change Password Logic ---
const showChangePassword = ref(false);
const changePasswordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const isChangingPassword = ref(false);
const changePasswordError = ref('');
const changePasswordSuccess = ref('');

const handleChangePassword = async () => {
   if (changePasswordForm.value.newPassword !== changePasswordForm.value.confirmPassword) {
    changePasswordError.value = '两次输入的新密码不一致';
    return;
  }
  
  isChangingPassword.value = true;
  changePasswordError.value = '';
  changePasswordSuccess.value = '';

  try {
    await $fetch('/api/admin/password', {
      method: 'PUT',
      body: { 
        oldPassword: changePasswordForm.value.oldPassword,
        newPassword: changePasswordForm.value.newPassword
      }
    });
    
    changePasswordSuccess.value = '密码修改成功';
    setTimeout(() => {
      showChangePassword.value = false;
      changePasswordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
      changePasswordSuccess.value = '';
    }, 1500);
  } catch (err) {
    changePasswordError.value = err.data?.message || '修改失败';
  } finally {
    isChangingPassword.value = false;
  }
};


const currentTab = ref('users'); // 'users' | 'chats'

// Utility: Debounce function
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// --- Users Logic ---
const users = ref([]);
const totalUsers = ref(0);
const userPage = ref(1);
const userSearch = ref('');
const loadingUsers = ref(false);

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const { data, total } = await $fetch('/api/admin/users', {
      params: {
        search: userSearch.value,
        limit: 20,
        offset: (userPage.value - 1) * 20
      }
    });
    users.value = data;
    totalUsers.value = total;
  } catch (e) {
    console.error(e);
  } finally {
    loadingUsers.value = false;
  }
};

const debouncedFetchUsers = debounce(() => {
  userPage.value = 1;
  fetchUsers();
}, 300);

// --- Messages Logic ---
const messages = ref([]);
const totalMessages = ref(0);
const messagePage = ref(1);
const loadingMessages = ref(false);
const messageFilters = ref({
  roomType: '', // '' | 'public' | 'private'
  roomId: '',
  userId: ''
});

const fetchMessages = async (resetPage = false) => {
  if (resetPage) messagePage.value = 1;
  loadingMessages.value = true;
  try {
    const { data, total } = await $fetch('/api/admin/messages', {
      params: {
        ...messageFilters.value,
        limit: 20,
        offset: (messagePage.value - 1) * 20
      }
    });
    messages.value = data;
    totalMessages.value = total;
  } catch (e) {
    console.error(e);
  } finally {
    loadingMessages.value = false;
  }
};

const debouncedFetchMessages = debounce(() => {
  fetchMessages(true);
}, 300);

const resetMessageFilters = () => {
  messageFilters.value = { roomType: '', roomId: '', userId: '' };
  fetchMessages(true);
};

// --- Shared ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

// --- Init ---
watch(currentTab, (newTab) => {
  if (isAuthenticated.value) {
    if (newTab === 'users' && users.value.length === 0) fetchUsers();
    if (newTab === 'chats' && messages.value.length === 0) fetchMessages();
  }
});

onMounted(() => {
  checkStatus();
  if (isAuthenticated.value) {
    fetchUsers();
  }
});
</script>
