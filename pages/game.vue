<template>
  <div class="visual-novel relative w-screen h-screen flex flex-col justify-end items-center">
    <button class="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            @click="goBack">
      ⬅ 回到關卡選單
    </button>

    <div class="absolute inset-0 bg-cover bg-center z-[-2]"
         :style="{ backgroundImage: `url(${sceneData?.background})` }"></div>

    <!-- 修正角色顯示 -->
    <CharacterImage v-for="character in activeCharacters"
                    class="z-[-1]"
                    :key="character.name"
                    :src="character.avatar"
                    :position="character.position" />

    <DialogBox v-if="sceneData?.dialogues" :dialogue="dialogue" @next="nextDialogue" />

    <component v-for="interaction in sceneData?.interactions"
               :key="interaction.id"
               :is="getInteractionComponent(interaction)"
               :interaction="interaction"
               @interaction-success="handleInteractionSuccess"
               @interaction-failure="handleInteractionFailure" />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();
const router = useRouter();
const { data: script } = await useFetch("/data/script.json");

const currentLevel = ref(route.query.level || "level0");
const currentScene = ref(route.query.scene || "scene1");

const sceneData = computed(() => script.value?.levels?.[currentLevel.value]?.scenes?.[currentScene.value] ?? {});
const dialogueIndex = ref(0);
const dialogue = computed(() => sceneData.value.dialogues?.[dialogueIndex.value] ?? {});

// 修正角色顯示邏輯
const activeCharacters = computed(() => {
  let characters = sceneData.value.characters ? [...sceneData.value.characters] : [];

  if (dialogue.value.character) {
    const newCharacter = {
      name: dialogue.value.character,
      avatar: dialogue.value.avatar || "",
      position: dialogue.value.position || { x: 50, y: 70 }
    };

    // 確保新角色不會重複加入
    if (!characters.some(c => c.name === newCharacter.name)) {
      characters.push(newCharacter);
    }
  }

  return characters;
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

const getInteractionComponent = (interaction) => {
  switch (interaction.type) {
    case "input":
      return InteractionInput;
    case "choice":
      return InteractionChoice;
    default:
      return null;
  }
};

const handleInteractionSuccess = (nextScene) => {
  if (nextScene) {
    router.push({ path: "/game", query: { level: currentLevel.value, scene: nextScene } });
  }
};

const handleInteractionFailure = () => {
  console.log("錯誤的輸入，請重試！");
};

const goBack = () => {
  router.push("/levels");
};
</script>