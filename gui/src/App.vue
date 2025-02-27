<template>
  <KeepAlive>
    <component :is="ChatAI" />
  </KeepAlive>
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
</style>
