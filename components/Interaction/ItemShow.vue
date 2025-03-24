<template>
  <div class="fixed inset-0 flex items-center justify-center bg-white/80 p-4">
    <div class="flex flex-col items-center">
      <img
        :src="src"
        :alt="alt"
        class="max-w-full max-h-[40vh] object-contain border-2 border-gray-700 rounded shadow-xl"
      />
      <p class="mt-2 text-sm text-gray-600" v-if="caption">{{ caption }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  caption?: string
}>()
</script>
