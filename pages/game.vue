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
    <ChapterEndDialog v-if="dialogueEnd"
          :nextLevel="nextLevel"
          @replay="replayChapter"
          @goLevels="goBack"
          @nextLevel="goNextLevel" />
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
const dialogueEnd = ref(false); // 修正：預設為 false
const showInteractions = ref(false); // 控制互動內容的顯示
const nextLevel = (computed(() => script.value.levels?.[currentLevel.value]?.unlocks));

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

// 修正角色顯示邏輯，支援多角色顯示
const activeCharacters = computed(() => {
  let characters = sceneData.value.characters ? [...sceneData.value.characters] : [];

  if (Array.isArray(dialogue.value.avatars) && dialogue.value.avatars.length > 0) {
    // 如果對話中有多個角色，則使用 avatars 陣列來顯示
    characters = dialogue.value.avatars.map(avatar => ({
      name: dialogue.value.character || "未知角色",
      avatar: avatar.src,
      position: avatar.position || { x: 50, y: 70 }
    }));
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
    // 嘗試獲取當前關卡的所有場景
    const sceneKeys = Object.keys(script.value.levels?.[currentLevel.value]?.scenes || {});
    const currentSceneIndex = sceneKeys.indexOf(currentScene.value);

    if (currentSceneIndex !== -1 && currentSceneIndex < sceneKeys.length - 1) {
      // 如果還有下一個場景，切換到 `scene2` 並從第一句對話開始
      currentScene.value = sceneKeys[currentSceneIndex + 1];
      currentDialogue.value = 0;
    } else {
      // 沒有更多場景，才標記為章節結束
      dialogueEnd.value = true;
    }
  }
};

// 進入下一關（如果有）
const goNextLevel = () => {
  if (nextLevel.value) {
    dialogueEnd.value = false; // 隱藏對話結束畫面
    router.push({ path: "/game", query: { level: nextLevel.value, scene: "scene1" } });
  }
};

// 重新觀看本章
const replayChapter = () => {
  currentDialogue.value = 0;
  dialogueEnd.value = false;
};

// 回到關卡選單
const goBack = () => {
  dialogueEnd.value = false; // 確保不影響其他關卡的進入
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