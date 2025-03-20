<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 text-white relative">
      <!-- 返回按鈕 -->
      <button class="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          @click="goBack">
          ⬅ 回到開始畫面
      </button>

      <!-- 關卡拖曳滾動容器 -->
      <div ref="levelsContainer"
           class="overflow-x-hidden w-3/4 relative cursor-grab select-none flex items-center scrollbar-hidden"
           @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag">
        <div ref="levelsWrapper"
             class="flex gap-6 py-4">
          <div v-for="(level, levelId) in filteredLevels" :key="levelId"
              class="w-64 h-40 flex flex-col justify-center items-center rounded-lg text-white text-lg font-bold transition-transform mx-4 bg-blue-500 cursor-pointer hover:scale-105"
              @click="selectLevel(level.id)">
              <span>{{ level.name }}</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const levelsContainer = ref(null);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const levels = ref({});
const unlockedLevels = ref([]);

// 讀取解鎖關卡
const loadUnlockedLevels = () => {
  const storedLevels = localStorage.getItem("unlockedLevels");
  unlockedLevels.value = storedLevels ? JSON.parse(storedLevels) : ["level0"];
};

// 監聽 localStorage 變化，確保解鎖狀態即時更新
const handleStorageChange = (event) => {
  if (event.key === "unlockedLevels") {
    loadUnlockedLevels();
  }
};

// 讀取關卡數據
const fetchLevels = async () => {
  try {
      const response = await fetch("/data/script.json");
      const scriptData = await response.json();
      levels.value = scriptData.levels || {};
      loadUnlockedLevels(); // 確保載入關卡後同步解鎖狀態
  } catch (error) {
      console.error("載入關卡時發生錯誤：", error);
  }
};

onMounted(() => {
    fetchLevels();
    loadUnlockedLevels();
    window.addEventListener("storage", handleStorageChange);
});

onUnmounted(() => {
    window.removeEventListener("storage", handleStorageChange);
});

// 監聽 `route`，當返回 `levels` 頁面時，確保 `unlockedLevels` 重新載入
watchEffect(() => {
  if (route.name === "levels") {
    loadUnlockedLevels();
  }
});

// 過濾出已解鎖的關卡
const filteredLevels = computed(() => {
  return Object.entries(levels.value)
    .filter(([key]) => unlockedLevels.value.includes(key))
    .map(([key, value]) => ({
      id: key,
      name: value.name
    }));
});

// 拖曳滾動
const startDrag = (event) => {
  isDragging.value = true;
  startX.value = event.pageX - levelsContainer.value.offsetLeft;
  scrollLeft.value = levelsContainer.value.scrollLeft;
  event.preventDefault();
};

const onDrag = (event) => {
  if (!isDragging.value) return;
  event.preventDefault();
  const x = event.pageX - levelsContainer.value.offsetLeft;
  const walk = (x - startX.value) * -1; // 反向移動
  levelsContainer.value.scrollLeft = scrollLeft.value + walk;
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

<style>
/* 隱藏滾動條 */
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>