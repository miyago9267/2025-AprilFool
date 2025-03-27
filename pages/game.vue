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

    <CharacterImage v-for="character in activeCharacters"
                    class="z-[-1]"
                    :key="character.name"
                    :src="character.avatar"
                    :position="character.position" />

    <InteractionItemShow
      v-if="dialogue?.type === 'image'"
      :src="dialogue.src"
      :caption="dialogue.caption"
    />

    <DialogBox
      v-else-if="sceneData?.dialogues"
      :dialogue="dialogue"
      @next="nextDialogue"
    />

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
    <ChapterEndDialog
          v-if="dialogueEnd"
          :nextLevel="nextLevel"
          :dialogue-end="dialogueEnd"
          @reset="resetScenes"
          @backLevel="goBack"
        />
  </div>
</template>

<script setup>
import { fetchLevelScript } from "~/composables/useLevelScript";
import InteractionItemShow from "~/components/Interaction/ItemShow.vue";

const router = useRouter();
const route = useRoute();
const currentLevel = ref(route.query.level || "level0");

const script = ref(null);

import { useGameProgress } from "~/composables/useGameProgress";
import { useUnlockLevels } from "~/composables/useUnlockLevels";

// 使用 useGameProgress 管理場景與對話
const { currentScene, currentDialogue, readScenes, resetReadScenes, markSceneAsRead } = useGameProgress();
const { unlockLevel } = useUnlockLevels();

const sceneData = computed(() => script.value?.scenes?.[currentScene.value] ?? {});
const dialogue = computed(() => sceneData.value.dialogues?.[currentDialogue.value] ?? {});
const dialogueEnd = ref(false);
const showInteractions = ref(false);
const currentInteractionIndex = ref(0);
const interactions = computed(() => sceneData.value.interactions || []);
const currentInteraction = computed(() => interactions.value[currentInteractionIndex.value]);
const nextLevel = computed(() => sceneData.value?.unlocks || script.value?.unlocks);

// 控制對話Log
const showLog = ref(false);
const logMessages = ref([]);

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

const getInteractionComponent = (interaction) => {
  switch (interaction.type) {
    case "input":
      return defineAsyncComponent(() => import("~/components/Interaction/Input.vue"));
    case "choice":
      return defineAsyncComponent(() => import("~/components/Interaction/Choices.vue"));
    case "puzzle":
      return defineAsyncComponent(() => import("~/components/Interaction/Puzzle.vue"));
    default:
      return "div";
  }
};

// 多角色顯示
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
    return;
  }

  // 所有對話跑完，準備顯示互動
  if (interactions.value.length > 0 && currentInteractionIndex.value < interactions.value.length) {
    showInteractions.value = true;
    return;
  }

  // 有定義 next scene 的話，跳去該 scene
  const nextScene = sceneData.value.next;
  if (nextScene) {
    markSceneAsRead(currentLevel.value, currentScene.value);
    currentScene.value = nextScene;
    currentDialogue.value = 0;
    currentInteractionIndex.value = 0;
    showInteractions.value = false;
    return;
  }

  // 否則根據順序跳下一個 scene 或結束
  const sceneKeys = Object.keys(script.value?.scenes || {});
  const currentSceneIndex = sceneKeys.indexOf(currentScene.value);

  if (currentSceneIndex !== -1 && currentSceneIndex < sceneKeys.length - 1) {
    markSceneAsRead(currentLevel.value, currentScene.value);
    currentScene.value = sceneKeys[currentSceneIndex + 1];
    currentDialogue.value = 0;
    currentInteractionIndex.value = 0;
    showInteractions.value = false;
  } else {
    const unlocks = sceneData.value.unlocks || [];
    if (unlocks.length > 0) {
      for (const key of unlocks) {
        unlockLevel(key);
      }
    }

    dialogueEnd.value = true;
  }
};

// 處理互動成功
const handleInteractionSuccess = (result) => {
  // 如果是選項互動且帶有 next scene，直接跳轉
  if (typeof result === "string") {
    currentScene.value = result;
    currentDialogue.value = 0;
    currentInteractionIndex.value = 0;
    showInteractions.value = false;
    return;
  }

  currentInteractionIndex.value++;
  if (currentInteractionIndex.value >= interactions.value.length) {
    showInteractions.value = false;
    nextDialogue(); // 若無指定 scene 則進入下一段
  }
};

const resetScenes = () => {
  currentDialogue.value = 0;
  currentInteractionIndex.value = 0;
  dialogueEnd.value = false;
  resetReadScenes();
  unlockLevel(nextLevel.value);
};

const goBack = () => {
  resetScenes();
  router.push("/levels");
};

// 使用 usePreload.ts
const { loading, progress, preloadImages } = usePreload();

onMounted(async () => {
    await preloadImages([sceneData.value.background, ...((sceneData.value.characters || []).map(c => c.avatar))]);
    currentLevel.value = route.query.level || "level0";
});

// 監聽 `route.query`，確保 `currentLevel` 即時更新
watchEffect(async () => {
    script.value = await fetchLevelScript(currentLevel.value);
});
</script>