<template>
  <Loading v-if="loading" :show="loading" :progress="progress" />
  <div v-else class="visual-novel relative w-screen h-screen flex flex-col justify-end items-center">
    <div id="fullscreen-interactor" class="absolute inset-0 z-5 cursor-pointer select-none" @click="nextDialogue"></div>
    <div class="absolute z-10 top-4 left-4 text-xl text-black px-4 py-2 rounded-xl bg-gray-100 border-2 border-[#823A96] border-solid hover:bg-gray-200 select-none font-text"
          @click="goBack">
          回到開始畫面
      </div>
    <div class="absolute z-10 top-4 right-4 text-xl text-black px-4 py-2 rounded-xl bg-gray-100 border-2 border-[#823A96] border-solid hover:bg-gray-200 select-none font-text"
      @click="showLog = true">
      查看對話記錄
    </div>

    <div class="absolute inset-0 bg-cover bg-center z-[-2]"
      :style="{ backgroundImage: `url(${sceneData?.background})` }"></div>

    <CharacterImage v-for="(character, index) in activeCharacters" class="z-[-1]" :key="`${character.name}-${index}`" :src="character.avatar"
      :position="character.position" />

    <InteractionItemShow v-if="dialogue?.type === 'image'" :src="dialogue.src" :caption="dialogue.caption" @click="nextDialogue" />

    <DialogBox v-else-if="sceneData?.dialogues" :dialogue="dialogue" @next="nextDialogue" @contextmenu.prevent="prevDialogue" />

    <Log :show="showLog" :logMessages="logMessages" @close="showLog = false" />

    <component v-show="showInteractions" :key="currentInteraction?.id" :is="getInteractionComponent(currentInteraction)"
      :interaction="currentInteraction" @interaction-success="handleInteractionSuccess" />

    <ChapterEndDialog v-if="dialogueEnd" :nextLevel="nextLevel?.[0]"  @reset="resetScenes" @backLevel="goBack" />
  </div>
</template>

<script setup>

const router = useRouter();
const route = useRoute();

const script = ref(null);

// 使用 useGameProgress 管理場景與對話
const { currentLevel, currentScene, currentDialogue, readScenes, resetReadScenes, markSceneAsRead } = useGameProgress();
const { unlockLevel } = useUnlockLevels();

const dialogueEnd = ref(false);
const showInteractions = ref(false);
const prevScene = ref({});

const sceneData = computed(() => script.value?.scenes?.[currentScene.value] ?? {});
const dialogue = computed(() => sceneData.value?.dialogues?.[currentDialogue.value] ?? {});
const currentInteraction = computed(() => sceneData.value?.interactions?.[0] || {});
const nextLevel = computed(() => sceneData.value?.unlocks || script.value?.unlocks);

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

// 控制對話Log
const showLog = ref(false);
const logMessages = ref([]);

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

// 上一句對話
const prevDialogue = () => {
  if (dialogueEnd.value) dialogueEnd.value = false;
  if (currentDialogue.value > 0) {
    currentDialogue.value--;
    logMessages.value.pop();
  } else {
    if (prevScene.value.scene) {
      currentScene.value = prevScene.value.scene;
      currentDialogue.value = prevScene.value.dialogue;
      prevScene.value = {};
    }
  }
};

// 下一句對話
const nextDialogue = () => {
  if (!sceneData.value.dialogues) return;

  // 跑對話陣列
  if (currentDialogue.value < sceneData.value.dialogues.length - 1) {
    logMessages.value.push({ character: dialogue.value.character, text: dialogue.value.text });
    currentDialogue.value++;
    return;
  }

  // 所有對話跑完，準備顯示互動
  if (currentInteraction.value?.type) {
    showInteractions.value = true;
    return;
  }

  // 有定義 next scene 的話，跳去該 scene
  const nextScene = sceneData.value?.next;
  if (nextScene) {
    prevScene.value = {
      scene: currentScene.value,
      dialogue: currentDialogue.value
    }
    markSceneAsRead(currentScene.value);
    currentScene.value = nextScene;
    currentDialogue.value = 0;
    showInteractions.value = false;
    return;
  }

  // 判斷還有沒有下一個scene
  if (!sceneData.value?.next) {
    const unlocks = sceneData.value?.unlocks || script.value?.unlocks || [];
    for (const key of unlocks) {
      unlockLevel(key);
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
    showInteractions.value = false;
    return;
  }
};

const resetScenes = () => {
  currentDialogue.value = 0;
  currentScene.value = "scene1";
  dialogueEnd.value = false;
  prevScene.value = {};
  logMessages.value = [];
  if (dialogueEnd.value) {
    unlockLevel(nextLevel.value);
    currentUnlockedLevels.value = JSON.parse(window.localStorage.getItem("unlockedLevels"));
  }
  resetReadScenes();
};

const goBack = () => {
  resetScenes();
  router.push("/levels");
};

// 使用 usePreload.ts
const { loading, progress, preloadImages } = usePreload();

onMounted(async () => {
  await preloadImages([sceneData.value.background, ...((sceneData.value.characters || []).map(c => c.avatar))]);
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      prevDialogue();
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextDialogue();
    }
  });
  if (route.query.level) {
    currentLevel.value = route.query.level;
  } else {
    router.push("/game", { query: { level: currentLevel.value } });
  }
});

// 監聽 `route.query`，確保 `currentLevel` 即時更新
watchEffect(async () => {
  loading.value = true;
  currentLevel.value = route.query.level;
  script.value = await fetchLevelScript(currentLevel.value);
  loading.value = false;
});
</script>

<style scoped>
#fullscreen-interactor {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
</style>