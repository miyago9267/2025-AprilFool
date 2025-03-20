<template>
  <Loading v-if="loading" :show="loading" :progress="progress" />
  <div v-else class="visual-novel relative w-screen h-screen flex flex-col justify-end items-center">
    <div class="absolute inset-0 z-5 cursor-pointer" @click="handleBackgroundClick"></div>
    <button class="absolute z-10 top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
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

    <button class="absolute z-10 top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            @click="showLog = true">
      查看對話記錄
    </button>
    <Log :show="showLog" :logMessages="logMessages" @close="showLog = false" />

    <component v-show="showInteractions"
               v-for="interaction in sceneData?.interactions"
               :key="interaction.id"
               :is="getInteractionComponent(interaction)"
               :interaction="interaction"
               @interaction-success="handleInteractionSuccess"
               @interaction-failure="handleInteractionFailure" />
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { data: script } = await useFetch("/data/script.json");

import { useGameProgress } from "~/composables/useGameProgress";
import { useUnlockLevels } from "~/composables/useUnlockLevels";
import { InteractionInput, InteractionChoices } from "#components";

// 使用 useGameProgress 管理場景與對話
const { currentScene, currentDialogue } = useGameProgress();
const currentLevel = ref(route.query.level || "level0");
const sceneData = computed(() => script.value?.levels?.[currentLevel.value]?.scenes?.[currentScene.value] ?? {});
const dialogue = computed(() => sceneData.value.dialogues?.[currentDialogue.value] ?? {});
const dialogueEnd = ref(false);
const showInteractions = ref(false); // 控制互動內容的顯示

// 控制對話Log
const showLog = ref(false);
const logMessages = ref([]);

// (已抽出解鎖關卡邏輯至 useUnlockLevels)

// 使得全螢幕皆可點擊
const handleBackgroundClick = (event) => {
  const interactionElements = document.querySelectorAll(".interaction-box");
  for (let element of interactionElements) {
    if (element.contains(event.target)) {
      return;
    }
  }
  nextDialogue();
};

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

// 下一句對話
const nextDialogue = () => {
  if (!sceneData.value.dialogues) return;

  if (currentDialogue.value < sceneData.value.dialogues.length - 1) {
    logMessages.value.push({ character: dialogue.value.character, text: dialogue.value.text });
    currentDialogue.value++;
  } else {
    dialogueEnd.value = true;
    if (sceneData.value.interactions?.length) {
      setTimeout(() => { showInteractions.value = true; }, 300);
      return;
    }
    useUnlockLevels(currentLevel.value).unlockLevel(currentLevel.value);
    setTimeout(() => { router.push("/levels"); }, 500);
  }
};

// (已抽出 unlockNextLevel 至 useUnlockLevels composable)

const selectChoice = (nextScene) => {
  if (nextScene === "menu") {
    router.push("/levels");
  } else {
    router.push({ path: "/game", query: { level: currentLevel.value, scene: nextScene } });
  }
};

const getInteractionComponent = (interaction) => {
  if (!interaction || !interaction.type) return null;

  switch (interaction.type) {
    case "input":
      return InteractionInput;
    case "choice":
      return InteractionChoice;
    default:
      console.error(`未知的互動類型: ${interaction.type}`);
      return null;
  }
};

const handleInteractionSuccess = (nextScene) => {
  if (nextScene) {
    router.push({ path: "/game", query: { level: currentLevel.value, scene: nextScene } });
  }
};

const handleInteractionFailure = () => {
  if (nextScene) {
    router.push({ path: "/game", query: { level: currentLevel.value, scene: nextScene } });
  }
};

const goBack = () => {
  router.push("/levels");
};

// 使用 usePreload.ts
const { loading, progress, preloadImages } = usePreload();

// (已簡化預載入邏輯至 usePreload composable)


onMounted(async () => {
    await preloadImages([sceneData.value.background, ...((sceneData.value.characters || []).map(c => c.avatar))]);
});

// 監聽 `route.query`，確保 `currentLevel`、`currentScene` 和對話狀態即時更新
watchEffect(() => {
    currentLevel.value = route.query.level || "level0";
    currentScene.value = route.query.scene || "scene1";
    currentDialogue.value = 0;
    dialogueEnd.value = false;
    showInteractions.value = false;
});

</script>