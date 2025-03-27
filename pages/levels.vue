<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center bg-gray-900 text-white relative">
      <!-- 返回按鈕 -->
      <button class="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          @click="goBack">
          ⬅ 回到開始畫面
      </button>

      <!-- 關卡滾動容器 -->
      <div ref="levelsContainer"
           :class="isMobile ? 'overflow-y-auto h-full w-3/4' : 'overflow-x-auto w-3/4'"
           class="relative cursor-grab select-none flex items-center scrollbar-hidden"
           @mousedown="!isMobile && startDrag" 
           @mousemove="!isMobile && onDrag" 
           @mouseup="!isMobile && endDrag" 
           @mouseleave="!isMobile && endDrag"
           @touchstart="isMobile && startTouch"
           @touchmove="isMobile && onTouchMove"
           @touchend="isMobile && endTouch">
        <div ref="levelsWrapper"
             :class="isMobile ? 'flex flex-col gap-6 py-4' : 'flex gap-6 py-4'">
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
import { fetchLevelIndex } from "~/composables/useLevelScript";

const router = useRouter();
const route = useRoute();
const levelsContainer = ref(null);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const scrollLeft = ref(0);
const scrollTop = ref(0);
const levels = ref({});
const unlockedLevels = ref([]);
const isMobile = ref(window.innerWidth <= 768); // 判斷是否為手機

// 監聽視窗大小變化，確保正確檢測裝置
const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768;
};
window.addEventListener("resize", checkDevice);

// 讀取解鎖關卡
const loadUnlockedLevels = () => {
  const storedLevels = localStorage.getItem("unlockedLevels");
  if (!storedLevels) {
    localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels.value));
  }
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
    const levelIndex = await fetchLevelIndex();
    const levelEntries = Object.entries(levelIndex);

    const results = await Promise.all(
      levelEntries.map(async ([key, { src }]) => {
        try {
          const res = await fetch(src);
          const levelData = await res.json();
          return [key, { ...levelData, id: key }];
        } catch (e) {
          console.warn(`無法載入 ${key} 的腳本：`, e);
          return [key, null];
        }
      })
    );

    levels.value = Object.fromEntries(results.filter(([, v]) => v));
    loadUnlockedLevels();
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
    window.removeEventListener("resize", checkDevice);
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

// 拖曳滾動 (桌面端)
const startDrag = (event) => {
  if (isMobile.value) return;
  isDragging.value = true;
  startX.value = event.pageX - levelsContainer.value.offsetLeft;
  scrollLeft.value = levelsContainer.value.scrollLeft;
  event.preventDefault();
};

const onDrag = (event) => {
  if (!isDragging.value || isMobile.value) return;
  event.preventDefault();
  const x = event.pageX - levelsContainer.value.offsetLeft;
  const moveX = (x - startX.value) * -1;
  levelsContainer.value.scrollLeft = scrollLeft.value + moveX;
};

const endDrag = () => {
  isDragging.value = false;
};

// 觸控滾動 (手機端)
const startTouch = (event) => {
  if (!isMobile.value) return;
  isDragging.value = true;
  startY.value = event.touches[0].pageY - levelsContainer.value.offsetTop;
  scrollTop.value = levelsContainer.value.scrollTop;
};

const onTouchMove = (event) => {
  if (!isDragging.value || !isMobile.value) return;
  const y = event.touches[0].pageY - levelsContainer.value.offsetTop;
  const moveY = (y - startY.value) * -1;
  levelsContainer.value.scrollTop = scrollTop.value + moveY;
};

const endTouch = () => {
  isDragging.value = false;
};

const selectLevel = (levelId) => {
  if (!unlockedLevels.value.includes(levelId)) return;
  router.push({ path: "/game", query: { level: levelId } });
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