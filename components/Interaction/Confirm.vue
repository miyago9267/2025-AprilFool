<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
            <p class="mb-6 text-gray-700">{{ message }}</p>
            <div class="flex justify-end space-x-4">
                <button class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black" @click="$emit('cancel')">
                    取消
                </button>
                <button class="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white" @click="$emit('confirm')">
                    確認
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: Boolean,
    title: {
        type: String,
        default: '確認操作'
    },
    message: {
        type: String,
        default: '你確定要執行這個操作嗎？'
    }
})

defineEmits(['confirm', 'cancel'])
</script>