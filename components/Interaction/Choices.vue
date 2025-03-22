<template>
  <div v-if="interaction.choices" class="interaction-box z-10 choices absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 w-3/4 max-w-md">
    <button v-for="choice in visibleChoices" :key="choice.text"
            class="bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-300 w-full text-center"
            @click="$emit('interaction-success', choice.next)">
      {{ choice.text }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useGameProgress } from "~/composables/useGameProgress";

const props = defineProps(["interaction"]);
const { readScenes } = useGameProgress();

const visibleChoices = computed(() => {
  return props.interaction.choices.filter(choice => {
    if (!choice.requires) return true;
    return choice.requires.every(req => readScenes.value.includes(req));
  });
});
</script>