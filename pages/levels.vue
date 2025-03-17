<template>
  <div class="w-screen h-screen flex justify-center items-center bg-gray-900 text-white">
      <!-- 返回按鈕 -->
      <button class="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          @click="goBack">
          ⬅ 回到開始畫面
      </button>

      <!-- 可拖動的關卡容器 -->
      <div ref="levelsContainer"
          class="flex gap-8 overflow-x-auto px-10 py-4 cursor-grab select-none"
          @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag">
          <div v-for="(level, levelId) in levels" :key="levelId"
              class="w-32 h-32 flex flex-col justify-center items-center rounded-lg text-white text-lg font-bold transition-transform"
              :class="{
                  'bg-blue-500 cursor-pointer hover:scale-110': unlockedLevels.includes(levelId),
                  'bg-gray-600 opacity-50 cursor-not-allowed': !unlockedLevels.includes(levelId)
              }"
              @click="selectLevel(levelId)">
              <span>{{ level.name }}</span>
              <span class="text-sm opacity-70">{{ levelId }}</span>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const levelsContainer = ref(null);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const levels = ref({});
const unlockedLevels = ref([]);

const loadUnlockedLevels = () => {
  const storedLevels = localStorage.getItem("unlockedLevels");
  unlockedLevels.value = storedLevels ? JSON.parse(storedLevels) : ["level0"];
};

// 從 script.json 讀取關卡
const fetchLevels = async () => {
  try {
      const response = await fetch("/data/script.json");
      const scriptData = await response.json();
      levels.value = scriptData.levels || {};
  } catch (error) {
      console.error("載入關卡時發生錯誤：", error);
  }
};

onMounted(() => {
    fetchLevels();
    loadUnlockedLevels();

    window.addEventListener("storage", loadUnlockedLevels);
});

onUnmounted(() => {
    window.removeEventListener("storage", loadUnlockedLevels);
});

watchEffect(() => {
    const storedLevels = localStorage.getItem("unlockedLevels");
    unlockedLevels.value = storedLevels ? JSON.parse(storedLevels) : ["level0"];
});

const startDrag = (event) => {
  isDragging.value = true;
  startX.value = event.pageX - levelsContainer.value.offsetLeft;
  scrollLeft.value = levelsContainer.value.scrollLeft;
};

const onDrag = (event) => {
  if (!isDragging.value) return;
  event.preventDefault();
  const x = event.pageX - levelsContainer.value.offsetLeft;
  const walk = (x - startX.value) * 1.5;
  levelsContainer.value.scrollLeft = scrollLeft.value - walk;
};

const endDrag = () => {
  isDragging.value = false;
};

const selectLevel = (levelId) => {
  if (!unlockedLevels.value.includes(levelId)) return;
  router.push({ path: "/game", query: { level: levelId, scene: "scene1" } });
};

const goBack = () => {
  router.push("/");
};
</script>