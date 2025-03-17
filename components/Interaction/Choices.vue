<template>
    <div class="choices absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 w-3/4 max-w-md">
      <button v-for="choice in choices" :key="choice.text"
              class="bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-300 w-full text-center"
              @click="$emit('select', choice.next)">
        {{ choice.text }}
      </button>
    </div>
  </template>
  
  <script setup>
  defineProps(["choices"]);
  </script>