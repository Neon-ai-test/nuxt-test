<script setup lang="ts">
import { ref } from 'vue';

const newLog = ref({
  title: '',
  content: '',
  level: 'info'
});

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isSubmitting = ref(false);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    selectedFile.value = file;
    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const clearFile = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  // 重置 input
  const input = document.getElementById('file-input') as HTMLInputElement;
  if (input) input.value = '';
};

const addLog = async () => {
  if (!newLog.value.title.trim() || !newLog.value.content.trim()) return;
  
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('title', newLog.value.title);
    formData.append('content', newLog.value.content);
    formData.append('level', newLog.value.level);
    
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    const response = await $fetch('/api/logs', {
      method: 'POST',
      body: formData
    });

    if (response.success) {
      alert('日志已保存！');
      // 重置表单
      newLog.value = {
        title: '',
        content: '',
        level: 'info'
      };
      clearFile();
    }
  } catch (error) {
    console.error('Failed to add log:', error);
    alert('添加失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container">
    <header>
      <h1>📝 快速记录</h1>
      <p class="subtitle">记录当下的想法</p>
    </header>

    <main>
      <section class="input-section">
        <form @submit.prevent="addLog" class="log-form">
          <div class="form-group">
            <input 
              v-model="newLog.title" 
              type="text" 
              placeholder="标题..." 
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <select v-model="newLog.level" class="form-select">
              <option value="info">Info (普通)</option>
              <option value="warning">Warning (警告)</option>
              <option value="error">Error (错误)</option>
            </select>
          </div>

          <div class="form-group">
            <textarea 
              v-model="newLog.content" 
              placeholder="详细内容..." 
              class="form-textarea"
              rows="6"
              required
            ></textarea>
          </div>

          <!-- 图片上传部分 -->
          <div class="form-group file-upload-group">
            <label for="file-input" class="file-label">
              📷 添加图片
            </label>
            <input 
              id="file-input"
              type="file" 
              accept="image/*"
              @change="handleFileChange"
              class="file-input"
            />
            
            <div v-if="previewUrl" class="image-preview">
              <img :src="previewUrl" alt="Preview" />
              <button type="button" @click="clearFile" class="remove-image-btn">×</button>
            </div>
          </div>

          <div class="actions">
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="isSubmitting || !newLog.title || !newLog.content"
            >
              {{ isSubmitting ? '保存中...' : '保存日志' }}
            </button>
            
            <NuxtLink to="/logs" class="manage-link">
              管理所有日志 →
            </NuxtLink>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.log-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.submit-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.manage-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
}

.manage-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

/* 图片上传样式 */
.file-upload-group {
  border: 2px dashed #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.file-input {
  display: none;
}

.file-label {
  cursor: pointer;
  color: #64748b;
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 6px;
  transition: background 0.2s;
}

.file-label:hover {
  background: #e2e8f0;
  color: #334155;
}

.image-preview {
  margin-top: 1rem;
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ef4444;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.remove-image-btn:hover {
  background: #dc2626;
}
</style>
