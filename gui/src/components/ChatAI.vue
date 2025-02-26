<template>
  <div class="chat-container" ref="chatMessagesContainer">
    <!-- 聊天记录展示区域 -->
    <div class="chat-messages">
      <TransitionGroup name="message" tag="div">
        <div v-for="(message, index) in chatMessages" :key="index"
          :class="['message-item', message.sender === '你' ? 'user' : 'ai']">
          <div class="message-header" :class="{ 'user-header': message.sender === '你' }">
            <span class="sender" :class="{ 'user-header': message.sender === '你' }">{{ message.sender }}</span>
            <el-avatar v-if="message.sender === '你'" class="user-avatar"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />

            <div class="timestamp-container">
              <span class="timestamp">{{ message.timestamp }}</span>
            </div>
          </div>
          <el-card shadow="hover" :class="['message-bubble', message.sender === '你' ? 'user-bubble' : 'ai-bubble']">
            <div class="message-content" :style="{ whiteSpace: 'pre-wrap' }">
              {{ message.content }}
            </div>
          </el-card>
        </div>
      </TransitionGroup>
    </div>
    <!-- 聊天输入区域 -->
    <div class="chat-input">
      <el-input v-model="inputMessage" placeholder="请输入消息" @keyup.enter="sendMessage" :disabled="isLoading"></el-input>
      <el-button @click="sendMessage" :loading="isLoading">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';

// 定义聊天消息数组
const chatMessages = ref<any>([
  { sender: 'MarsCodeAI', content: '欢迎使用聊天功能！' }
]);

const chatMessagesContainer = ref<HTMLElement | null>(null);

// 定义输入框消息
const inputMessage = ref('');

// 添加加载状态
const isLoading = ref(false);

// 发送消息的函数
const sendMessage = async () => {
  if (inputMessage.value.trim() !== '') {
    // 添加用户消息到聊天记录
    chatMessages.value.push({
      sender: '你',
      content: inputMessage.value,
      timestamp: new Date().toLocaleTimeString()
    });

    // 滚动到底部
    await nextTick();
    scrollToBottom();

    isLoading.value = true;
    // 模拟 AI 回复
    setTimeout(() => {
      chatMessages.value.push({
        sender: 'MarsCodeAI',
        content: '这是 AI 的回复示例。',
        timestamp: new Date().toLocaleTimeString()
      });
      isLoading.value = false;

      // AI 回复后也滚动到底部
      scrollToBottom();
    }, 1000);

    // 清空输入框
    inputMessage.value = '';
  }
};

// 修改后的滚动到底部函数
const scrollToBottom = () => {
  if (chatMessagesContainer.value) {
    const container = chatMessagesContainer.value;
    const start = container.scrollTop;
    const end = container.scrollHeight - container.clientHeight;
    const duration = 300; // 动画持续时间

    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // 缓动函数

      container.scrollTop = start + (end - start) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
};
</script>

<style scoped>
/* 调整整体配色 */
.chat-container {
  background-color: #1e1e1e;
  /* 深色背景 */
}

/* 调整消息卡片样式 */
.message-item.user .el-card {
  background-color: #1976d2;
  /* Material Blue 700 */
  color: #ffffff;
}

.message-item.ai .el-card {
  background-color: #424242;
  /* Material Grey 800 */
  color: #ffffff;
}

/* 调整输入区域样式 */
.chat-input {
  background-color: #2d2d2d;
  /* 稍浅的深色 */
}

/* 调整Element Plus组件配色 */
.chat-input .el-input :deep(.el-input__inner) {
  background-color: #333333;
  border-color: #444444;
  color: #ffffff;
}

.chat-input .el-button {
  background-color: #1976d2;
  /* Material Blue 700 */
  border-color: #1976d2;
  color: #ffffff;
}

.chat-input .el-button:hover {
  background-color: #1565c0;
  /* Material Blue 800 */
  border-color: #1565c0;
}

.chat-input .el-button:active {
  background-color: #0d47a1;
  /* Material Blue 900 */
  border-color: #0d47a1;
}

.chat-input .el-button.is-disabled {
  background-color: #424242;
  /* Material Grey 800 */
  border-color: #424242;
  color: #757575;
  /* Material Grey 600 */
}

/* 调整消息卡片阴影 */
.el-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

/* 调整加载状态 */
.el-button.is-loading::before {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 调整消息头部样式 */
.message-header {
  color: #bdbdbd;
  /* Material Grey 400 */
}

.user-header {
  background-color: rgba(25, 118, 210, 0.1);
  /* Material Blue 700 with opacity */
}

.user-header .sender {
  color: white;
  /* Material Blue 300 */
}

/* 调整时间显示样式 */
.timestamp-container {
  color: #757575;
  /* Material Grey 600 */
  background-color: rgba(66, 66, 66, 0.9);
  /* Material Grey 800 with opacity */
}

/* 调整滚动条样式 */
.chat-messages::-webkit-scrollbar-track {
  background: #333333;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #616161;
  /* Material Grey 700 */
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #757575;
  /* Material Grey 600 */
}

/* 调整消息布局 */
.message-item {
  margin-bottom: 15px;
  max-width: 70%;
}

.message-item.user {
  margin-left: auto;
  /* 用户消息靠右 */
}

.message-item.ai {
  margin-right: auto;
  /* AI消息靠左 */
}

/* 优化消息卡片样式 */
.message-item.user .el-card {
  /* background-color: #409eff; */
  color: white;
}

.message-item.ai .el-card {
  background-color: #f0f0f0;
}

/* 调整消息头部样式 */
.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
}

.message-item.user .message-header {
  color: rgba(255, 255, 255, 0.8);
}

/* 合并后的样式 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  background-color: #1e1e1e;
  /* 合并深色背景 */
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  height: calc(100vh - 100px);
  margin-bottom: 80px;
  scroll-behavior: smooth;
  transition: scroll-top 0.3s ease-out;
  will-change: scroll-position;
}

.message-item {
  margin-bottom: 15px;
  max-width: 70%;
}

.message-item.user {
  margin-left: auto;
  padding-top: 20px;
  text-align: right;
}

.message-item.ai {
  margin-right: auto;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 12px;
  color: #666;
  position: relative;
}

.user-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row-reverse;
  background-color: rgba(25, 118, 210, 0.1);
}

.user-header .sender {
  color: #64b5f6;
}

.timestamp-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
  font-size: 12px;
  color: white;
}

/* 合并消息卡片样式 */
.message-item .el-card {
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.message-item.user .el-card {
  background-color: #333333;
  color: white;
  border-radius: 20px 0 20px 20px;
  margin-left: auto;
  width: fit-content;
  /* max-width: 80%; */
}

.message-item.ai .el-card {
  background-color: #333333;
  /* 稍浅的灰色 */
  color: white;
  /* 深色文字 */
  border-radius: 0 20px 20px 20px;
  max-width: 100%;
  width: fit-content;
}

/* 合并输入区域样式 */
.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.chat-input .el-input {
  flex: 1;
  margin-right: 15px;
}

.chat-input .el-input :deep(.el-input__inner) {
  border-radius: 20px;
  padding: 12px 20px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  min-height: 40px;
  background-color: #333333;
  border-color: #444444;
  color: #ffffff;
}

/* 合并按钮样式 */
.chat-input .el-button {
  background-color: #1976d2;
  border-color: #1976d2;
  color: #ffffff;
}

.chat-input .el-button:hover {
  background-color: #1565c0;
  border-color: #1565c0;
}

.chat-input .el-button:active {
  background-color: #0d47a1;
  border-color: #0d47a1;
}

.chat-input .el-button.is-disabled {
  background-color: #424242;
  border-color: #424242;
  color: #757575;
}

/* 合并滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 合并用户头像样式 */
.user-avatar {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 合并消息动画 */
.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.message-move {
  transition: transform 0.5s ease;
}

.message-item.user.message-enter-active {
  transition-delay: 0.1s;
}

.message-item.ai.message-enter-active {
  transition-delay: 0.2s;
}
</style>