<template>
  <div v-if="dialogue" class="dialog-box z-20 w-4/5 min-h-42 bg-black/70 text-white px-8 pt-1 py-2 rounded-lg cursor-pointer shadow-lg"
       @click="$emit('next')">
    <p v-if="dialogue.character" class="text-2xl font-bold mb-2 ">{{ dialogue.character }}</p>
    <p class="text-lg" v-html="dialogue.text"></p>
  </div>
</template>

<script setup>
defineProps(["dialogue"]);
</script>

<style scoped>
.dialog-box{
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
</style>