<template>
    <img :src="src" class="character absolute max-h-[60vh]"
         :style="{
            left: position?.x ? `${position.x}%` : '50%',
            top: position?.y ? `${position.y}%` : '70%',
            transform: 'translate(-50%, -50%)'
         }">
</template>

<script setup>
defineProps({
    src: String,
    position: Object
});
</script>