<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { ideMessenger } from '../api/ideMessenger';
defineProps<{ msg: string }>()
const count = ref(0)
const infoRef = ref('')
const onClick = ()=>{
  count.value +=1
  // ideMessenger.send(count.value)
}
onMounted(() => {
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="onClick">count is {{ count }}</button>
    <p style="color:red">{{infoRef}}</p>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
