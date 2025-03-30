<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 class="text-xl font-bold mb-4">章節完成</h2>
            <p class="mb-6">請選擇下一步行動</p>
            <div class="flex flex-col gap-4">
                <button class="select-bar" @click="$emit('reset')">
                    重新觀看
                </button>
                <button class="select-bar" @click="$emit('backLevel')">
                    返回關卡選單
                </button>
                <button v-if="nextLevel" class="select-bar"
                    @click="goNextLevel()">
                    進入下一關
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const emit = defineEmits(["reset"]);
const props = defineProps({nextLevel: String});

const goNextLevel = () => {
    emit("reset");
    router.push({ path: "/game", query: { level: props.nextLevel, scene: "scene1" } });
};
</script>

<style scoped>
.select-bar {
    /* Rectangle 5 */
    box-sizing: border-box;

    width: 315px;
    height: 44px;

    border: 2px solid #823A96;
    background: #fff;
    border-radius: 20px;
}

.select-bar:hover {
    /* Rectangle 8 */
    box-sizing: border-box;

    width: 315px;
    height: 44px;

    background: #823A96;
    color: #fff;
    border: 2px solid #823A96;
    border-radius: 20px;
}
</style>