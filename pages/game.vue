<template>
  <div class="visual-novel relative w-screen h-screen flex flex-col justify-end items-center">
    <button class="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            @click="goBack">
      ⬅ 回到關卡選單
    </button>
    <div class="absolute inset-0 bg-cover bg-center z-[-2]"
         :style="{ backgroundImage: `url(${sceneData?.background})` }"></div>

    <CharacterImage v-for="character in activeCharacters"
        class="z-[-1]"
        :key="character.name"
        :src="character.avatar"
        :position="character.position" />

    <DialogBox v-if="sceneData?.dialogues" :dialogue="dialogue" @next="nextDialogue" />
    <Choices v-if="sceneData?.choices && dialogueEnd"
             :choices="sceneData.choices"
             @select="selectChoice"
             class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();
const router = useRouter();
const { data: script } = await useFetch("/data/script.json");

const currentLevel = ref(route.query.level || "level1");
const currentScene = ref(route.query.scene || "scene1");

const sceneData = computed(() => script.value?.levels?.[currentLevel.value]?.scenes?.[currentScene.value] ?? {});
const dialogueIndex = ref(0);
const dialogue = computed(() => sceneData.value.dialogues?.[dialogueIndex.value] ?? {});
const dialogueEnd = ref(false);

const activeCharacters = computed(() => {
  if (dialogue.value.character) {
    return [{
      name: dialogue.value.character,
      avatar: dialogue.value.avatar || "",
      position: dialogue.value.position || { x: 50, y: 70 }
    }];
  }
  return sceneData.value.characters || [];
});

const nextDialogue = () => {
  if (!sceneData.value.dialogues) return;

  if (dialogueIndex.value < sceneData.value.dialogues.length - 1) {
    dialogueIndex.value++;
  } else {
    dialogueEnd.value = true;
  }
};

const selectChoice = (nextScene) => {
  if (nextScene === "menu") {
    router.push("/levels");
  } else {
    currentScene.value = nextScene;
    dialogueIndex.value = 0;
    dialogueEnd.value = false;
  }
};

const goBack = () => {
  router.push("/levels");
};
</script>