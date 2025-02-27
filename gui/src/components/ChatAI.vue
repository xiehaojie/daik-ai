<template>
  <div class="chat-container">
    <!-- 聊天记录展示区域 -->
    <div class="chat-messages" ref="chatMessagesContainer">
      <TransitionGroup name="message" tag="div">
        <div v-for="(message, index) in chatMessages" :key="index"
          :class="['message-item', message.sender === 'user' ? 'user' : 'ai']">
          <div :class="[message.sender === 'user' ? 'user-header' : 'message-header']">
            <span :class="[message.sender === 'user' ? 'user-header-sender' : 'message-header-sender']">{{
              message.sender
            }}</span>
            <el-avatar v-if="message.sender === 'user'" class="user-avatar" :src="userIcon" />
            <el-avatar v-else class="user-avatar" :src="chatIcon" />

          </div>
          <el-card :class="['message-bubble', message.sender === 'user' ? 'user-bubble' : 'ai-bubble']">
            <div class="timestamp">{{ message.timestamp }}</div>
            <div class="message-content" :style="{ whiteSpace: 'pre-wrap' }">
              {{ message.content }}
            </div>
          </el-card>

        </div>

      </TransitionGroup>
    </div>
    <!-- 聊天输入区域 -->
    <div class="chat-input">
      <el-input v-model="inputMessage" size="large" placeholder="请输入消息" @keyup.enter="sendMessage"
        :disabled="isLoading"></el-input>
      <div class="chat-input-button" @click="sendMessage">
        <img src="../assets/send.png">
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue';
import chatIcon from "../assets/chat.png"
import userIcon from "../assets/user.png"
onMounted(() => {
  console.log('重新渲染了');
  scrollToBottom(); // 页面加载后自动滚动到底部
})

// 定义聊天消息数组
const chatMessages = ref<any>([
  { sender: 'DAIK', content: '欢迎使用聊天功能！' }
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
      sender: 'user',
      content: inputMessage.value,
      timestamp: new Date().toLocaleTimeString()
    });

    // 滚动到底部
    await nextTick();
    scrollToBottom();

    isLoading.value = true;
    // 模拟 AI 回复
    setTimeout(async () => {
      chatMessages.value.push({
        sender: 'DAIK',
        content: '这是 AI 的回复示例。',
        timestamp: new Date().toLocaleTimeString()
      });
      isLoading.value = false;

      // AI 回复后也滚动到底部
      await nextTick();
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
/* 调整消息卡片样式 */
.message-item.user .el-card {
  background-color: #1976d2;
  /* Material Blue 700 */
  color: #ffffff;
  position: relative;
  /* 添加相对定位 */
}

.message-item.ai .el-card {
  background-color: #424242;
  /* Material Grey 800 */
  color: #ffffff;
  position: relative;
  /* 添加相对定位 */
}

/* 调整消息卡片阴影 */
.el-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

/* 调整加载状态 */
.el-button.is-loading::before {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-header {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  align-items: center;
  color: white;
  padding: 5px;
  font-size: 20px;
  font-weight: 600;
}

.user-header-sender {
  color: white;
}
.chat-messages::-webkit-scrollbar {
  display: none; 
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
  height: calc(100vh - 200px);
  margin-bottom: 80px;
  scroll-behavior: smooth;
  transition: scroll-top 0.3s ease-out;
  will-change: scroll-position;
  -ms-overflow-style: none;
  scrollbar-width: none;
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
  justify-content: flex-end;
  flex-direction: row-reverse;
  gap: 5px;
  align-items: center;
  color: white;
  padding: 5px;
  font-size: 20px;
  font-weight: 600;
}

.timestamp {
  display: flex;
  margin-bottom: 5px;
  color: chartreuse;
  font-size: 12px;
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
  position: absolute;
  bottom: 10px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  align-items: center;
  padding: 7px;
  background-color: #1e1e1e;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  border-radius: 10px;
  border: 2px solid palegreen;
}

.chat-input-button {
  margin-left: auto;
  margin-right: 5px;
  padding: 5px;

  img {
    width: 20px;
    height: 20px;
  }
}

.chat-input-button:hover {
  border-radius: 5px;
  background-color: #a8a8a8;
  cursor: pointer;
}

.chat-input .el-input {
  flex: 1;
  margin-right: 15px;
}

.chat-input .el-input :deep(.el-input__inner) {
  transition: all 0.3s ease;
  min-height: 40px;
  border: 0;
  background-color: transparent !important;
  box-shadow: none;
  /* border-color: #444444; */
  color: white;
}

.chat-input .el-input :deep(.el-input__wrapper) {
  transition: all 0.3s ease;
  min-height: 40px;
  background-color: transparent !important;
  box-shadow: none;
  border: 0;
  /* border-color: #444444; */
  color: white;
}



/* 合并用户头像样式 */
.user-avatar {
  /* position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
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