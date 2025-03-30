<template>
  <Loading v-if="loading" :show="loading" :progress="progress" />
  <div v-else class="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-r text-blue">
    <div id="mainpage-title"
      class="absolute top-3 left-3 w-4/5 h-40 bg-cover bg-no-repeat bg-center"
      style="background-image: url('/images/bg/main_title.png');"
    ></div>
    <div id="mainpage-image"
      class="absolute bottom-0 right-0 w-[90vw] h-[80vh] bg-cover bg-no-repeat bg-center"
      style="background-image: url('/images/bg/main_chara.png');"
    ></div><div id="mainpage-image"
      class="absolute bottom-0 right-0 w-full h-full bg-cover bg-no-repeat bg-center z-[-1]"
      style="background-image: url('/images/bg/background_base.png');"
    ></div>

    <div class="absolute h-full left-0 flex-1 flex flex-col justify-center items-center">
      <ul class="text-2xl font-bold mb-8 text-center list-none">
        <li>
          <div
            :class="buttonTheme"
            @click="startGame">
            開始遊戲</div>
        </li>
        <li>
          <div
            :class="buttonTheme"
            @click="showCredit = !showCredit">
            製作名單</div>
        </li>
        <li>
          <div
            :class="buttonTheme"
            @click="showConfirm=!showConfirm">
            重置進度</div>
        </li>
      </ul>
    </div>

    <Credit :show="showCredit" @close="showCredit = false" />
    <InteractionConfirm
      :show="showConfirm"
      title="確定要重置進度嗎？"
      message="這將清除所有已解鎖的關卡與場景進度，無法復原。"
      @confirm="showConfirm = false; resetProgress()"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const router = useRouter();
const showCredit = ref(false);
const showConfirm = ref(false);
const { currentScene, currentDialogue, initialProgress, firstLoad } = useGameProgress();
const { initialUnlockLevels, currentUnlockedLevels } = useUnlockLevels();
const { loading, progress, preloadImages } = usePreload();

const imagesToPreload = ref([]);
const menuList = ref([
  { name: "關卡", path: "/levels" },
  { name: "場景", path: "/scenes" },
  { name: "對話", path: "/dialogue" },
]);
const imagePaths = import.meta.glob("/public/images/**/*.{jpg,jpeg,png,gif,webp}");
const buttonTheme = "bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 mb-4 font-text"

const startGame = () => {
  router.push({ path: "/levels"});
};

const resetProgress = () => {
  firstLoad.value = true;
  router.go(0);
};

onMounted(async () => {
  await preloadImages();
});

watchEffect(() => {
  if (!window.localStorage.getItem("unlockedLevels")) {
    initialUnlockLevels();
  }
});
</script>

<style scoped>

</style>