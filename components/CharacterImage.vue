<template>
    <img :src="src" class="character absolute"
         :class="effectClass"
         :style="{
            left: position?.x ? `${Math.min(90, Math.max(10, position.x))}%` : '50%',
            top: position?.y ? `${position.y}%` : '70%',
            transform: 'translate(-50%, -50%) scale(' + ((position?.size || 1) * 0.25) + ')'
         }">
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    src: String,
    position: Object
});

// 設定動畫特效 class
const effectClass = computed(() => {
    if (!props.position?.effect) return '';
    switch (props.position.effect) {
        case "jump":
            return "animate-jump";
        case "shake":
            return "animate-shake";
        default:
            return '';
    }
});
</script>

<style>
.character {
    position: absolute;
}

@keyframes jump {
    0%, 100% { transform: translate(-50%, -50%) scale(var(--scale, 1)); }
    25% { transform: translate(-50%, calc(-50% - 20px)) scale(var(--scale, 1)); }
    50% { transform: translate(-50%, -50%) scale(var(--scale, 1)); }
    75% { transform: translate(-50%, calc(-50% - 20px)) scale(var(--scale, 1)); }
}
.animate-jump {
    animation: jump 0.6s ease-out;
}

@keyframes shake {
    0%, 100% { transform: translate(-50%, -50%) scale(var(--scale, 1)); }
    25% { transform: translate(calc(-50% -5px), -50%) scale(var(--scale, 1)); }
    50% { transform: translate(calc(-50% +5px), -50%) scale(var(--scale, 1)); }
    75% { transform: translate(calc(-50% -5px), -50%) scale(var(--scale, 1)); }
}
.animate-shake {
    animation: shake 0.4s ease-in-out;
}
</style>