<template>
  <div class="h-screen bg-slate-50 flex flex-col overflow-hidden">
    <!-- 头部 -->
    <header class="flex-none bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg z-10">
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
            <h1 class="text-xl font-bold tracking-wide">公共聊天室</h1>
            <div class="flex items-center gap-3 text-xs opacity-90">
              <span class="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span>在线: {{ onlineCount }}</span>
              </span>
              <span class="flex items-center gap-1">
                <span :class="['w-1.5 h-1.5 rounded-full', socketConnected ? 'bg-green-400' : 'bg-red-400']"></span>
                {{ socketConnected ? '已连接' : '连接中...' }}
              </span>
            </div>
          </div>
        </div>
            <div class="text-right flex items-center gap-3">
              <!-- 静音按钮 -->
              <button 
                @click="toggleMute"
                class="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors relative group"
                :title="isMuted ? '开启声音' : '静音'"
              >
                <svg v-if="!isMuted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 2.75 2.75 0 010-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                </svg>
              </button>

              <div class="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shadow-inner">
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
      class="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50"
    >
      <!-- 系统消息 -->
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-2xl">
          👋
        </div>
        <p>暂无消息，开始聊天吧！</p>
      </div>

      <!-- 消息项 -->
      <div 
        v-for="message in messages" 
        :key="message.id"
        :id="'msg-' + message.id"
        :class="['flex items-end gap-2 group', message.userId === userInfo.userId ? 'flex-row-reverse' : 'flex-row']"
      >
        <!-- 头像 -->
        <div 
          class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-indigo-300 transition-all"
          :class="message.userId === userInfo.userId ? 'bg-indigo-500' : 'bg-slate-400'"
          @click="handleMention(message)"
        >
          {{ (message.nickname || message.userId)[0]?.toUpperCase() }}
        </div>

        <div 
          :class="[
            'max-w-[70%] p-3 shadow-sm transition-all duration-200 hover:shadow-md relative',
            message.userId === userInfo.userId 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-tr-none' 
              : isMentioned(message)
                ? 'bg-yellow-50 text-slate-800 border border-yellow-300 ring-2 ring-yellow-200/50 rounded-2xl rounded-tl-none'
                : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none'
          ]"
        >
          <div 
            v-if="message.userId !== userInfo.userId"
            class="font-medium mb-1 text-xs opacity-60 pl-1 flex items-center gap-1 cursor-pointer hover:opacity-100 transition-opacity"
            :class="isMentioned(message) ? 'text-yellow-600' : 'text-slate-500'"
            @click="handleMention(message)"
            title="点击@Ta"
          >
            <span>{{ message.nickname || message.userId }}</span>
            <span v-if="isMentioned(message)" class="bg-yellow-200 text-yellow-700 text-[10px] px-1.5 rounded-full font-bold">@我</span>
          </div>
          <div class="text-sm leading-relaxed break-words">
            <template v-if="message.messageType === 'image'">
              <img 
                :src="message.content" 
                class="w-60 h-40 rounded-lg cursor-pointer hover:opacity-90 transition-opacity object-cover bg-slate-100"
                @click="openPreview(message.content, 'image')"
                loading="lazy"
                alt="图片"
              >
            </template>
            <template v-else-if="message.messageType === 'video'">
              <div class="relative group cursor-pointer w-60 h-40" @click="openPreview(message.content, 'video')">
                <video 
                  :src="message.content" 
                  class="w-full h-full rounded-lg object-cover bg-slate-100"
                ></video>
                <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg">
                  <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-indigo-600 ml-1">
                      <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="message.messageType === 'audio'">
              <div class="flex items-center gap-2 min-w-[200px]">
                <audio controls :src="message.content" class="h-10 w-64 rounded-lg bg-slate-100"></audio>
              </div>
            </template>
            <template v-else-if="message.messageType === 'file' || isFileJSON(message.content)">
              <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 min-w-[200px]">
                <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM12.75 1.5v3c0 1.036.84 1.875 1.875 1.875h3l-4.875-4.875z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate">
                    {{ getFileData(message.content).name }}
                  </p>
                  <p class="text-xs text-slate-400">
                    {{ formatFileSize(getFileData(message.content).size) }}
                  </p>
                </div>
                <a 
                  :href="getFileData(message.content).url" 
                  download
                  target="_blank"
                  class="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="下载文件"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </template>
            <template v-else>
              {{ message.content }}
            </template>
          </div>
          <div 
            :class="[
              'text-[10px] mt-1 text-right',
              message.userId === userInfo.userId ? 'text-blue-100/70' : 'text-slate-400'
            ]"
          >
            {{ formatTime(message.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- @提醒通知 -->
    <div 
      v-if="unreadMentions.length > 0"
      class="fixed bottom-28 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none"
    >
      <div 
        v-for="mention in unreadMentions"
        :key="mention.id"
        @click="scrollToMention(mention)"
        class="bg-white/95 backdrop-blur border border-yellow-300 shadow-xl rounded-xl p-3 cursor-pointer hover:bg-yellow-50 transition-all transform hover:-translate-y-1 flex items-center gap-3 max-w-xs pointer-events-auto"
      >
        <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xs shrink-0">
          @
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-800 truncate">
            {{ mention.nickname || mention.userId }} @了你
          </p>
          <p class="text-xs text-slate-500 truncate max-w-[150px]">
            {{ mention.content }}
          </p>
        </div>
        <button 
          @click.stop="unreadMentions = unreadMentions.filter(m => m.id !== mention.id)"
          class="text-slate-400 hover:text-slate-600 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 消息输入 -->
    <div class="flex-none p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-20">
      <div class="container mx-auto max-w-4xl">
        <div class="flex items-end gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all duration-200">
          <template v-if="!isRecording">
            <!-- 录音按钮 -->
            <button 
              @click="startRecording"
              class="p-3 text-slate-400 hover:text-red-500 transition-colors duration-200"
              title="发送语音"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
              </svg>
            </button>

            <!-- 文件上传按钮 -->
            <button 
              @click="$refs.fileInput.click()"
              :disabled="isUploading"
              class="p-3 text-slate-400 hover:text-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="发送文件"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <input 
              ref="fileInput"
              type="file" 
              class="hidden"
              @change="handleFileUpload"
            >
            
            <input 
              ref="msgInputRef"
              v-model="messageInput"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="输入消息..."
              class="flex-1 bg-transparent border-none px-4 py-3 focus:ring-0 text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
            >
          </template>

          <div v-else class="flex-1 flex items-center gap-4 px-2 py-3 min-w-0">
             <div class="flex items-center gap-2 text-red-500 animate-pulse shrink-0">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                <span class="font-bold font-mono">{{ formatDuration(recordingTime) }}</span>
             </div>
             <span class="text-slate-400 text-sm truncate">正在录音...</span>
             <div class="flex-1"></div>
             <button @click="cancelRecording" class="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-sm hover:bg-slate-300 transition-colors shrink-0">取消</button>
          </div>

          <button 
            @click="isRecording ? stopRecording() : sendMessage()"
            :disabled="(!messageInput.trim() && !isUploading && !isRecording)"
            class="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center aspect-square"
          >
            <svg v-if="!isUploading && !isRecording" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <svg v-else-if="isRecording" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <svg v-else class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 媒体预览 Modal -->
    <div v-if="previewUrl" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" @click="closePreview">
      <div class="relative max-w-full max-h-full flex flex-col items-center" @click.stop>
        <button 
          @click="closePreview"
          class="absolute -top-12 right-0 text-white hover:text-slate-300 p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <img 
          v-if="previewType === 'image'" 
          :src="previewUrl" 
          class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        >
        <video 
          v-else-if="previewType === 'video'" 
          :src="previewUrl" 
          controls 
          autoplay
          class="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
        ></video>
        
        <div class="mt-4 flex gap-4">
          <a 
            :href="previewUrl" 
            download
            target="_blank"
            class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors backdrop-blur-md"
            @click.stop
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3.25-3.25M12 12.75l3.25-3.25M12 12.75V3" />
            </svg>
            下载原文件
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { io, Socket } from 'socket.io-client';

const router = useRouter();
const config = useRuntimeConfig();
const socket = ref(null);
const messages = ref([]);
const messageInput = ref('');
const onlineCount = ref(0);
const messagesContainer = ref(null);
const roomId = 'public';
const socketConnected = ref(false);
const isUploading = ref(false);
const previewUrl = ref('');
const previewType = ref('');
const fileInput = ref(null);
const isMuted = ref(false);
const audio = ref(null);
const msgInputRef = ref(null);
const unreadMentions = ref([]);

// 录音相关状态
const isRecording = ref(false);
const recordingTime = ref(0);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const recordingTimer = ref(null);

// 开始录音
const startRecording = async () => {
  console.log('Attempting to start recording...');
  
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    const errorMsg = '您的浏览器不支持录音功能，请确保使用 HTTPS 或 localhost 访问，并使用现代浏览器。';
    console.error(errorMsg);
    alert(errorMsg);
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Microphone access granted');
    
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };
    
    mediaRecorder.value.onstop = () => {
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.value.start();
    console.log('MediaRecorder started');
    
    isRecording.value = true;
    recordingTime.value = 0;
    
    // 计时器
    recordingTimer.value = setInterval(() => {
      recordingTime.value++;
    }, 1000);
    
  } catch (err) {
    console.error('无法启动录音:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      alert('无法访问麦克风，请在浏览器设置中允许访问麦克风。');
    } else if (err.name === 'NotFoundError') {
      alert('未检测到麦克风设备。');
    } else {
      alert(`无法启动录音: ${err.message}`);
    }
  }
};

// 停止录音并发送
const stopRecording = () => {
  if (!mediaRecorder.value || !isRecording.value) return;
  
  mediaRecorder.value.onstop = async () => {
    // 停止所有轨道
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    clearInterval(recordingTimer.value);
    isRecording.value = false;
    
    const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
    const file = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
    
    await uploadAndSendAudio(file);
  };
  
  mediaRecorder.value.stop();
};

// 取消录音
const cancelRecording = () => {
  if (!mediaRecorder.value || !isRecording.value) return;
  
  mediaRecorder.value.onstop = () => {
    // 停止所有轨道
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    clearInterval(recordingTimer.value);
    isRecording.value = false;
    audioChunks.value = []; // 清空数据
  };
  
  mediaRecorder.value.stop();
};

// 上传并发送语音
const uploadAndSendAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  isUploading.value = true;
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    
    const result = await response.json();
    if (result.success) {
      socket.value.emit('send_message', {
        roomId,
        content: result.data.url,
        messageType: 'audio'
      });
    }
  } catch (error) {
    console.error('发送语音失败:', error);
    alert('发送语音失败');
  } finally {
    isUploading.value = false;
  }
};

// 格式化录音时间
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 滚动到指定消息
const scrollToMention = (message) => {
  const elementId = `msg-${message.id}`;
  const el = document.getElementById(elementId);
  
  if (el) {
    console.log('滚动到消息:', elementId);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // 移除未读提醒
    unreadMentions.value = unreadMentions.value.filter(m => m.id !== message.id);
  } else {
    console.warn('未找到消息元素:', elementId);
  }
};

// 判断是否被@
const isMentioned = (message) => {
  if (!message.content || typeof message.content !== 'string') return false;
  if (!userInfo.value.nickname) return false; // 确保有昵称
  if (message.userId === userInfo.value.userId) return false;
  
  const mentionTag = `@${userInfo.value.nickname}`;
  // 简单匹配，只要包含 @昵称 即可
  return message.content.includes(mentionTag);
};

// 处理@点击
const handleMention = (message) => {
  if (message.userId === userInfo.value.userId) return;
  
  const name = message.nickname || message.userId;
  const mentionText = `@${name} `;
  
  messageInput.value += mentionText;
  
  nextTick(() => {
    msgInputRef.value?.focus();
  });
};

// 解析文件数据
const getFileData = (content) => {
  try {
    return JSON.parse(content);
  } catch (e) {
    return { url: content, name: '未知文件', size: 0 };
  }
};

// 判断内容是否为文件JSON格式
const isFileJSON = (content) => {
  try {
    const data = JSON.parse(content);
    return data && typeof data === 'object' && 'url' in data && 'name' in data;
  } catch (e) {
    return false;
  }
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

// 预览媒体
const openPreview = (url, type) => {
  previewUrl.value = url;
  previewType.value = type;
};

const closePreview = () => {
  previewUrl.value = '';
  previewType.value = '';
};

// 处理文件上传
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 重置 input
  event.target.value = '';

  const formData = new FormData();
  formData.append('file', file);

  isUploading.value = true;
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    if (result.success) {
      let content = result.data.url;
      
      // 如果是普通文件，将元数据打包到 content 中
      if (result.data.type === 'file') {
        content = JSON.stringify({
          url: result.data.url,
          name: result.data.filename,
          size: result.data.size
        });
      }

      // 发送消息
      socket.value.emit('send_message', {
        roomId,
        content: content,
        messageType: result.data.type
      });
    }
  } catch (error) {
    console.error('上传失败:', error);
    alert('上传失败，请重试');
  } finally {
    isUploading.value = false;
  }
};

// 切换静音状态
const toggleMute = () => {
  isMuted.value = !isMuted.value;
  localStorage.setItem('chat_muted', isMuted.value.toString());
};

// 播放提示音
const playNotificationSound = () => {
  if (isMuted.value || !audio.value) return;
  
  // 重置播放进度，确保快速触发时能重播
  audio.value.currentTime = 0;
  audio.value.play().catch(err => {
    // 用户未交互前自动播放可能会被浏览器拦截，这是正常现象
    console.warn('播放提示音被拦截:', err);
  });
};

// 返回首页
const goBack = () => {
  router.push('/');
};

// 加载历史消息
const loadHistoryMessages = async () => {
  console.log('DEBUG: loadHistoryMessages', { messages: messages.value, isRef: !!messages.value });
  try {
    const response = await fetch(`/api/chat/messages?roomId=${roomId}&limit=50`);
    const result = await response.json();
    
    if (result.success) {
      if (messages && typeof messages === 'object' && 'value' in messages) {
         messages.value = result.data;
        await nextTick();
        scrollToBottom(false);
      } else {
         console.error('CRITICAL: messages ref is broken', messages);
      }
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
const scrollToBottom = (smooth = false) => {
  if (messagesContainer.value) {
    if (smooth) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
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
    socketConnected.value = true;
    
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

  socket.value.on('new_message', async (message) => {
    messages.value.push(message);
    
    // 如果不是自己发的消息，播放提示音
    if (message.userId !== userInfo.value.userId) {
      playNotificationSound();
      
      // 如果被@，添加未读提醒
      if (isMentioned(message)) {
        console.log('收到@消息，添加到提醒列表:', message);
        unreadMentions.value.push(message);
      }
    }
    
    await nextTick();
    scrollToBottom(true);
  });

  socket.value.on('user_joined', () => {
    // 可以在这里更新在线用户数
  });

  socket.value.on('user_left', () => {
    // 可以在这里更新在线用户数
  });

  socket.value.on('disconnect', () => {
    console.log('WebSocket 断开连接');
    socketConnected.value = false;
  });
};

// 生命周期
onMounted(() => {
  // 初始化音频对象
  audio.value = new Audio('/pikachu.mp3');
  
  // 读取本地静音设置
  const savedMuted = localStorage.getItem('chat_muted');
  if (savedMuted !== null) {
    isMuted.value = savedMuted === 'true';
  }

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
});

onUnmounted(() => {
  // 断开 WebSocket 连接
  if (socket.value) {
    socket.value.emit('leave_room', roomId);
    socket.value.disconnect();
  }
});
</script>
