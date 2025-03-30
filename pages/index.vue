<template>
  <Loading v-if="loading" :show="loading" :progress="progress" />
  <div v-else class="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-r text-blue">
    <div class="absolute top-0 left-0 min-h-[10vh] bg-cover bg-no-repeat bg-center font-text px-10">
      <h1 class="md:text-5xl text-4xl text-[#CB64AC] mb-5">恐怖！</h1>
      <span class="md:block hidden text-6xl text-[#7A358D] mt-5">怪盜XD對決早稻前學園偵探社！</span>
      <div class="md:hidden block text-3xl text-[#7A358D] mt-5">
        <span class="mb-2">怪盜XD</span>
        <span class="font-bold text-rose mb-2">對決</span><br>
        <span class="">早稻前學園偵探社！</span>
      </div>
    </div>
    <div id="mainpage-image"
      class="md:block hidden absolute bottom-0 right-0 w-[100vw] h-[80vh] bg-cover bg-no-repeat bg-center"
      style="background-image: url('/images/bg/main_chara.png');"
    ></div>
    <div id="mainpage-chara-mobile"
      class="md:hidden block absolute bottom-0 w-[100vw] h-[80vh] flex justify-center items-end"
      :style="mobileCharaStyle"
    ></div>
    <div id="mainpage-image"
      class="md:block hidden absolute bottom-0 w-full h-full bg-cover bg-no-repeat bg-center z-[-1]"
      style="background-image: url('/images/bg/background_base.png');"
    ></div>

    <div class="absolute h-full md:left-0 flex-1 flex flex-col md:justify-center items-center justify-end">
      <ul class="text-2xl font-bold mb-8 text-center list-none px-0">
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
const buttonTheme = " text-black px-8 py-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 mb-4 font-text"

const mobileCharaStyle = ref({});

const getRandomMobileCharaImage = () => {
  const nums = ['01', '02', '04', '07', '08', '09', '10', '11', 'nobita'];
  const rand = nums[Math.floor(Math.random() * nums.length)];
  return `/images/chara/${rand}.png`;
};

const startGame = () => {
  router.push({ path: "/levels"});
};

const resetProgress = () => {
  firstLoad.value = true;
  router.go(0);
};

onMounted(async () => {
  await preloadImages();
  mobileCharaStyle.value = {
    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1)), url('${getRandomMobileCharaImage()}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'end',
  };
});

watchEffect(() => {
  if (!window.localStorage.getItem("unlockedLevels")) {
    initialUnlockLevels();
  }
});
</script>

<style scoped>

</style>