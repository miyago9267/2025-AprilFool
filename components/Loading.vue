<template>
    <div v-if="show" class="w-screen h-screen flex flex-col justify-center items-center bg-black text-white">
        <h1 class="text-3xl font-bold mb-4">載入中...</h1>
        <div class="w-3/4 max-w-md bg-gray-700 rounded-full h-4 overflow-hidden">
            <div class="bg-blue-500 h-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="text-sm text-gray-400 mt-4 absolute bottom-4 left-4">💡 {{ currentTip }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps(["show", "progress"]);

const tips = [
    "你知道嗎？怪盜XD最討厭番茄醬了。",
    "其實沒有早稻前學園這所學校。",
    "你可能會在Tips裡發現隱藏的訊息，應該...吧。",
    "當你看到這則訊息時，代表你看到了一則訊息。",
    "在早稻前學園裡面每過一秒，就浪費了你1/60一分鐘。",
    "請你仔細閱讀這些Tips，這樣我就可以多浪費你幾秒。",
    "這個載入進度條的時間固定會是載入時間+3秒。",
    "逸一時，誤一世，逸久逸久罷以齡。",
    "飲水機其實是出水機，你才是飲水機。",
    "之所以每次進遊戲都要讀取這麼久，是因為要載入你媽這個超肥的素材。",
    "是的，我在北京。",
    "這個遊戲是作者在上班的時候裝忙寫出來的。",
    "即刻充值VIP888，獲得一鍵通關魔關羽。",
    "喔一一阿一喔一一阿一。",
    "水源米亞果非常可愛。"
];

const currentTip = ref(tips[0]);


// 每次丟不同的提示出來
const generateRandomTip = () => {
  const randomIndex = Math.floor(Math.random() * tips.length);
  currentTip.value = tips[randomIndex];
};

onMounted(() => {
    generateRandomTip();
});
</script>