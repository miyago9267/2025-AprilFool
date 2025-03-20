<template>
  <Loading v-if="loading" :show="loading" :progress="progress" />
  <div v-else class="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-r text-blue">
    <h1 class="text-5xl font-bold mb-8 text-center">
      恐怖！怪盜XD對決早稻前學園偵探社！
    </h1>
    <button
      class="bg-white text-black px-8 py-4 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 mb-4"
      @click="startGame">
      開始遊戲
    </button>
    <button
      class="bg-white text-black px-8 py-4 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 mb-4"
      @click="showCredit = !showCredit">
      製作名單
    </button>
    <button
      class="bg-white text-black px-8 py-4 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
      @click="resetProgress">
      重置進度
    </button>
    <Credit :show="showCredit" @close="showCredit = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGameProgress } from "~/composables/useGameProgress";

const router = useRouter();
const showCredit = ref(false);
const { currentScene, currentDialogue } = useGameProgress(); // 整合遊戲進度

// 預加載素材
const { loading, progress, preloadImages } = usePreload();
const isFirstLoad = ref(true);

const imagesToPreload = ref([]);
const imagePaths = import.meta.glob("/public/images/**/*.{jpg,jpeg,png,gif,webp}");

// 初始化解鎖關卡與場景進度
const initializeGameProgress = () => {
  if (!localStorage.getItem("unlockedLevels")) {
    localStorage.setItem("unlockedLevels", JSON.stringify(["level0"]));
  }
  if (!localStorage.getItem("currentScene")) {
    localStorage.setItem("currentScene", "scene1");
  }
  if (!localStorage.getItem("currentDialogue")) {
    localStorage.setItem("currentDialogue", "0");
  }
};

const startGame = () => {
  router.push({ path: "/levels", query: { scene: currentScene.value, dialogue: currentDialogue.value } });
};

const resetProgress = () => {
  localStorage.setItem("unlockedLevels", JSON.stringify(["level0"]));
  localStorage.setItem("currentScene", "scene1");
  localStorage.setItem("currentDialogue", "0");
  router.go(0);
};

onMounted(async () => {
  initializeGameProgress();
  await preloadImages();
});
</script>