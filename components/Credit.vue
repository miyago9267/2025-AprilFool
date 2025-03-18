<template>
    <div v-show="show" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50" @click.self="closeModal">
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-md text-black relative">
        <button class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold
               hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
                @click="closeModal">
        ✖
        </button>
        <h2 class="text-2xl font-bold mb-4 text-center">製作名單</h2>
        <p class="mb-4 text-sm text-gray-700">這款遊戲是我們的努力結晶，希望你喜歡！</p>
        <ul class="list-disc pl-5">
          <li>遊戲設計：XXX</li>
          <li>程式開發：YYY</li>
          <li>美術設計：ZZZ</li>
          <li>劇情編寫：AAA</li>
        </ul>
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