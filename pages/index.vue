<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    <h1 class="text-5xl font-bold mb-8 text-center">
      恐怖！怪盜XD對決早稻前學園偵探社！
    </h1>
    <button class="bg-white text-black px-8 py-4 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 mb-4"
            @click="startGame">
      開始遊戲
    </button>
    <button class="bg-white text-black px-8 py-4 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 mb-4"
            @click="">
      製作名單
    </button>
    <button class="bg-white text-black px-8 py-4 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
            @click="resetProgress">
      重製進度
    </button>
  </div>
</template>

<script setup>
const router = useRouter();

const startGame = () => {
  router.push("/levels");
};

const resetProgress = () => {
  localStorage.removeItem("unlockedLevels");
  router.go(0);
};
</script>