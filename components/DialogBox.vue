<template>
  <div v-if="dialogue" class="dialog-box z-20 w-4/5 min-h-36 bg-black/70 text-white px-8 py-3 rounded-lg cursor-pointer shadow-lg"
       @click="$emit('next')">
    <p v-if="dialogue.character" class="text-2xl font-bold mb-2">{{ dialogue.character }}</p>
    <p class="text-lg">{{ dialogue.text }}</p>
  </div>
</template>

<script setup>
defineProps(["dialogue"]);
</script>