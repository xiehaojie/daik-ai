<template>
  <div id="app">
    <ChatAI />
  </div>
</template>

<script lang="ts" setup>
import ChatAI from './components/ChatAI.vue';
import { ref } from 'vue';
const vv = ref({})
window.addEventListener('message', event => {
    vv.value = event.data;
    });
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
