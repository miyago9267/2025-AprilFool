<template>
    <div class="w-screen h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 class="text-4xl font-bold mb-6">恐怖！怪盜XD對決早稻前學園偵探社！</h1>
      <button class="bg-white text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-300"
              @click="startGame">
        開始遊戲
      </button>
    </div>
  </template>

  <script setup>
  const router = useRouter();
  const startGame = () => {
    router.push("/levels");
  };
  </script>