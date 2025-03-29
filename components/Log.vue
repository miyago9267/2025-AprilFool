<template>
<div v-show="show" class="fixed inset-0 z-10 bg-black/50 flex justify-center items-center z-50" @click.self="closeModal">
    <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg text-black relative">
    <button class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold
                hover:bg-gray-300 transition duration-200 active:scale-90"
        @click="closeModal">
        ✖
    </button>
    <h2 class="text-2xl font-bold mb-4 text-center">對話記錄</h2>
    <div ref="logContainer" class="max-h-96 overflow-y-auto bg-gray-100 p-4 rounded">
        <div v-for="(log, index) in logMessages" :key="index" class="mb-2">
        <p v-if="log.character" class="text-sm font-bold">{{ log.character }}</p>
        <p class="text-base" v-html="log.text"></p>
        </div>
    </div>
    </div>
</div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onUpdated } from "vue";

defineProps({
    show: Boolean,
    logMessages: Array
});
const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};

const logContainer = ref(null);

onUpdated(() => {
    if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
});
</script>