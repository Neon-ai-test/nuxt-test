<script setup lang="ts">
import { ref } from 'vue';

const newLog = ref({
  title: '',
  content: '',
  level: 'info'
});

const isSubmitting = ref(false);

const addLog = async () => {
  if (!newLog.value.title.trim() || !newLog.value.content.trim()) return;
  
  isSubmitting.value = true;
  try {
    const response = await $fetch('/api/logs', {
      method: 'POST',
      body: newLog.value
    });

    if (response.success) {
      alert('日志已保存！');
      // 重置表单
      newLog.value = {
        title: '',
        content: '',
        level: 'info'
      };
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
      <h1>� 快速记录</h1>
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
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  color: #666;
  margin-top: 0.5rem;
}

.log-form {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box; /* 确保 padding 不会撑大宽度 */
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #42b883;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

.submit-btn {
  padding: 10px 24px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.submit-btn:disabled {
  background-color: #a8dcc5;
  cursor: not-allowed;
}

.manage-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.manage-link:hover {
  color: #42b883;
}
</style>
