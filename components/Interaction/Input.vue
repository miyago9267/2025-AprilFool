<template>
    <div class="absolute bottom-32 left-1/2 transform -translate-x-1/2 p-4 bg-white text-black rounded">
      <p>{{ interaction.placeholder }}</p>
      <input v-model="userInput" class="border p-2 rounded w-full" type="text" />
      <button @click="checkAnswer"
              class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        確認
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from "vue";
  
  const props = defineProps(["interaction"]);
  const emit = defineEmits(["interaction-success", "interaction-failure"]);
  
  const userInput = ref("");
  
  const checkAnswer = () => {
    if (userInput.value === props.interaction.correctAnswer) {
      emit("interaction-success", props.interaction.onSuccess);
    } else {
      emit("interaction-failure");
    }
  };
  </script>