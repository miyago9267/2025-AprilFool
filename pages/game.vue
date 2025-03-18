<template>
  <div class="visual-novel relative w-screen h-screen flex flex-col justify-end items-center">
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
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";
import InteractionInput from '~/components/Interaction/Input.vue';
import InteractionChoice from '~/components/Interaction/Choices.vue';

const route = useRoute();
const router = useRouter();
const { data: script } = await useFetch("/data/script.json");

// 控制當前關卡及場景
const currentLevel = ref(route.query.level || "level0");
const currentScene = ref(route.query.scene || "scene1");

// 控制當前對話狀態
const sceneData = computed(() => script.value?.levels?.[currentLevel.value]?.scenes?.[currentScene.value] ?? {});
const dialogueIndex = ref(0);
const dialogue = computed(() => sceneData.value.dialogues?.[dialogueIndex.value] ?? {});
const dialogueEnd = ref(false);
const showInteractions = ref(false); // 控制互動內容的顯示

// 控制對話Log
const showLog = ref(false);
const logMessages = ref([]);

// 寫入 LocalStorage 的已解鎖關卡
const unlockedLevels = ref(JSON.parse(localStorage.getItem("unlockedLevels") || "[]"));

onMounted(() => {
    window.addEventListener("storage", updateUnlockedLevels);
});

onUnmounted(() => {
    window.removeEventListener("storage", updateUnlockedLevels);
});

// 監聽 `route.query`，確保 `currentLevel` 和 `currentScene` 即時更新
watchEffect(() => {
    currentLevel.value = route.query.level || "level0";
    currentScene.value = route.query.scene || "scene1";
    dialogueIndex.value = 0;
    dialogueEnd.value = false;
    showInteractions.value = false; // 確保切換場景時隱藏互動內容
});

const updateUnlockedLevels = () => {
    console.log("偵測到 LocalStorage 變更，重新讀取關卡狀態");
    unlockedLevels.value = JSON.parse(localStorage.getItem("unlockedLevels") || "[]");
};

const handleBackgroundClick = (event) => {
  console.log("背景被點擊"); // Debug 訊息
  const interactionElements = document.querySelectorAll(".interaction-box");
  for (let element of interactionElements) {
    if (element.contains(event.target)) {
      console.log("點擊在互動框內，忽略");
      return;
    }
  }
  console.log("觸發下一句對話");
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
const nextDialogue = () => {
  if (!sceneData.value.dialogues) return;

  if (dialogueIndex.value < sceneData.value.dialogues.length - 1) {
    logMessages.value.push({ character: dialogue.value.character, text: dialogue.value.text });
    dialogueIndex.value++;
  } else {
    dialogueEnd.value = true;
    const hasInteractions = sceneData.value.interactions && sceneData.value.interactions.length > 0;
    if (hasInteractions) {
      setTimeout(() => {
        showInteractions.value = true;
      }, 300);
      return;
    }
    unlockNextLevel();
    setTimeout(() => {
      router.push("/levels");
    }, 500);
  }
};

// 解鎖下一關
const unlockNextLevel = () => {
  if (!script.value || !script.value.levels) {
    console.error("Script data is not loaded yet.");
    return;
  }

  const storedLevels = localStorage.getItem("unlockedLevels");
  let unlocked = storedLevels ? JSON.parse(storedLevels) : [];

  console.log("當前關卡:", currentLevel.value);
  console.log("已解鎖關卡:", unlocked);

  // 確保當前關卡在 `unlockedLevels`
  if (!unlocked.includes(currentLevel.value)) {
    unlocked.push(currentLevel.value);
    console.log(`已新增當前關卡: ${currentLevel.value}`);
  }

  // 取得 `script.json` 內的 `unlocks` 陣列
  const currentUnlocks = script.value.levels[currentLevel.value]?.unlocks || [];

  // 解鎖指定的關卡
  currentUnlocks.forEach(nextLevel => {
    if (!unlocked.includes(nextLevel)) {
      unlocked.push(nextLevel);
      console.log(`解鎖下一關: ${nextLevel}`);
    }
  });

  // 儲存到 LocalStorage
  localStorage.setItem("unlockedLevels", JSON.stringify(unlocked));
  unlockedLevels.value = [...unlocked]; // 讓 Vue 重新渲染
  console.log("更新後的已解鎖關卡:", unlocked);
};

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
  console.log("錯誤的輸入，請重試！");
};

const goBack = () => {
  router.push("/levels");
};
</script>