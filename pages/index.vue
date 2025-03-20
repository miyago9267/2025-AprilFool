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
      重製進度
    </button>
    <Credit :show="showCredit" @close="showCredit = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const router = useRouter();
const showCredit = ref(false);

// 預加載素材
const { loading, progress, preloadImages } = usePreload();
const isFirstLoad = ref(true);

const imagesToPreload = ref([]);
const imagePaths = import.meta.glob("/public/images/**/*.{jpg,jpeg,png,gif,webp}");


const startGame = () => {
  router.push("/levels");
};

const resetProgress = () => {
  localStorage.removeItem("unlockedLevels");
  router.go(0);
};

onMounted(async () => {
  await preloadImages();
});
</script>