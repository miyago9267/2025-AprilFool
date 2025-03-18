<template>
  <div class="interaction-box absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-6 bg-white text-black rounded shadow-lg">
    <p class="text-lg font-bold mb-2">{{ interaction.placeholder }}</p>
    <input v-model="userInput" class="border py-3 rounded w-full text-lg text-center" type="text" />
    <button @click="checkAnswer" class="mt-4 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 w-full">
      確認
    </button>
    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps(["interaction"]);
const emit = defineEmits(["interaction-success", "interaction-failure"]);

const userInput = ref("");
const errorMessage = ref("");

const checkAnswer = () => {
  if (userInput.value === props.interaction.correctAnswer) {
    emit("interaction-success", props.interaction.onSuccess);
  } else {
    errorMessage.value = "密碼錯誤，請重試";
    emit("interaction-failure");
  }
};
</script>