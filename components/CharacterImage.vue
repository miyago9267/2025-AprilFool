<template>
  <div class="absolute w-full h-full overflow-hidden">
    <img :src="src" class="character absolute lg:max-h-[80vh] max-h-[70vh] md:top-[60%] top-[65%]"
         :class="effectClass"
         :style="{
            left: position?.x ? `${Math.min(90, Math.max(10, position.x))}%` : '50%',
            transform: 'translate(-50%, -50%) scale(' + (position?.size || 1) + ')'
         }">
  </div>
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
            return props.position.effect;
    }
});
</script>

<style>
@keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

.fade-in {
    animation: fade-in 0.5s ease-in;
}

@keyframes fade-out {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

.fade-out {
    animation: fade-out 0.5s ease-out;
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
    25% { transform: translate(calc(-50% - 5px), -50%) scale(var(--scale, 1)); }
    50% { transform: translate(calc(-50% + 5px), -50%) scale(var(--scale, 1)); }
    75% { transform: translate(calc(-50% - 5px), -50%) scale(var(--scale, 1)); }
}
.animate-shake {
    animation: shake 0.4s ease-in-out;
    transform-origin: center center;
}

</style>