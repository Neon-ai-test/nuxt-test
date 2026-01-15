<template>
  <div 
    class="flex items-center gap-2 min-w-[60px] cursor-pointer select-none transition-all duration-200"
    :class="[
      isSelf ? 'flex-row-reverse' : 'flex-row',
    ]"
    :style="{ width: width + 'px' }"
    @click="togglePlay"
  >
    <!-- 语音图标 -->
    <div class="relative w-5 h-5 flex items-center justify-center shrink-0">
      <svg 
        v-if="!isPlaying"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        class="w-5 h-5"
        :class="[isSelf ? 'rotate-180' : '']"
      >
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 2.75 2.75 0 010-11.668.75.75 0 010-1.06z" />
      </svg>
      
      <!-- 播放动画图标 -->
      <div v-else class="flex items-center justify-center w-5 h-5" :class="[isSelf ? 'rotate-180' : '']">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
           <!-- 喇叭主体 -->
           <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
           <!-- 波浪1 -->
           <path class="animate-voice-1" d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
           <!-- 波浪2 -->
           <path class="animate-voice-2" d="M18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 2.75 2.75 0 010-11.668.75.75 0 010-1.06z" />
        </svg>
      </div>
    </div>

    <!-- 时长 -->
    <span class="text-xs font-medium opacity-80 min-w-[20px] text-center">
      {{ duration ? Math.round(duration) + '"' : '...' }}
    </span>

    <audio 
      ref="audioRef" 
      :src="src" 
      @loadedmetadata="onLoadedMetadata" 
      @ended="onEnded"
      @pause="isPlaying = false"
      @play="isPlaying = true"
      class="hidden"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  isSelf: {
    type: Boolean,
    default: false
  }
});

const audioRef = ref(null);
const isPlaying = ref(false);
const duration = ref(0);

const width = computed(() => {
  if (!duration.value) return 80; // 默认宽度
  // 最小80px，每秒增加4px，最大240px
  return Math.min(240, 80 + duration.value * 4);
});

const togglePlay = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    // 暂停其他所有正在播放的音频 (可选，为了更好的体验)
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(a => {
      if (a !== audioRef.value) a.pause();
    });
    audioRef.value.play();
  }
};

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
    // 如果获取不到 duration (Infinity)，尝试设置 currentTime
    if (duration.value === Infinity) {
       audioRef.value.currentTime = 1e101;
       audioRef.value.ontimeupdate = function() {
           this.ontimeupdate = () => {
               return;
           }
           audioRef.value.currentTime = 0;
           duration.value = audioRef.value.duration;
       }
    }
  }
};

const onEnded = () => {
  isPlaying.value = false;
};

// 监听 src 变化，重置状态
watch(() => props.src, () => {
  isPlaying.value = false;
  duration.value = 0;
});
</script>

<style scoped>
@keyframes voice-1 {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes voice-2 {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; delay: 0.3s; }
}

.animate-voice-1 {
  animation: voice-1 1s infinite;
}

.animate-voice-2 {
  animation: voice-2 1s infinite 0.5s; /* 延迟 */
}
</style>