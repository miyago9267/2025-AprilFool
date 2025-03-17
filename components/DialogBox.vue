<template>
  <div v-if="dialogue" class="dialog-box w-4/5 min-h-36 bg-black/70 text-white p-4 rounded-lg cursor-pointer shadow-lg"
       @click="$emit('next')">
    <p class="text-lg">{{ dialogue.text }}</p>
  </div>
</template>

<script setup>
defineProps(["dialogue"]);
</script>