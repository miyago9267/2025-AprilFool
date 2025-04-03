<template>
    <div v-show="show" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50" @click.self="closeModal">
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-md text-black relative">
        <button class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold
               hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
                @click="closeModal">
        ✖
        </button>
        <h2 class="text-2xl font-bold mb-4 text-center">製作名單</h2>
        <p class="mb-4 text-sm text-gray-700"><span class="font-bold text-black text-sm">作者的廢話：</span><br>啦啦啦，雖然是每年例行的活動啦，每年真的都是趕在死線前掰出東西來呢。今年的故事就沒有去年那麼黑暗啦，好好享受愉快的推理劇情吧。</p>
        <ul class="list-disc pl-5">
          <li>遊戲設計：<a href="https://github.com/miyago9267">Miyago9267</a>/<a href="https://x.com/Caryolite_">Caryolite</a></li>
          <li>程式開發：Miyago9267</li>
          <li>美術設計：Caryolite</li>
          <li>劇情編寫：Miyago9267/Caryolite</li>
        </ul>
        <span class="opacity-0 text-xl hover:opacity-100 transition-opacity duration-[5000ms]">
          answer{4pRi1Fo01}
        </span>
      </div>
    </div>
  </template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps(["show"]);
const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};
</script>