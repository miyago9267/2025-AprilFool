<template>
  <div class="flex flex-col items-center justify-center p-4">
    <img
      :src="src"
      :alt="alt"
      class="max-w-full max-h-[60vh] object-contain border border-gray-400 rounded shadow-md"
    />
    <p class="mt-2 text-sm text-gray-600" v-if="caption">{{ caption }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  caption?: string
}>()
</script>
