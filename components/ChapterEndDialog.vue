<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 class="text-xl font-bold mb-4">章節完成！</h2>
            <p class="mb-6">請選擇下一步行動：</p>
            <div class="flex flex-col gap-4">
                <button class="bg-blue-500 text-white py-2 rounded hover:bg-blue-600" @click="$emit('replay')">
                    重新觀看
                </button>
                <button class="bg-gray-500 text-white py-2 rounded hover:bg-gray-600" @click="$emit('goLevels')">
                    返回關卡選單
                </button>
                <button v-if="nextLevel" class="bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    @click="$emit('nextLevel')">
                    進入下一關
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    nextLevel: String
});
</script>