const { initialUnlockLevels } = useUnlockLevels();

export function useGameProgress() {
  const currentLevel = useState<string>("currentLevel", () => {
    return localStorage.getItem("currentLevel") || "level0";
  });

  const currentScene = useState<string>("currentScene", () => {
    return localStorage.getItem("currentScene") || "scene1";
  });

  const currentDialogue = useState<number>("currentDialogue", () => {
    return parseInt(localStorage.getItem("currentDialogue") || "0", 10);
  });

  const readScenes = useState<string[]>("readScenes", () => {
    return JSON.parse(localStorage.getItem("readScenes") || "[]");
  });

  const firstLoad = useState<boolean>("firstLoad", () => {
    return localStorage.getItem("firstLoad") === null;
  });

  watch(currentLevel, (newLevel) => {
    localStorage.setItem("currentLevel", newLevel);
  });

  watch(currentScene, (newScene) => {
    localStorage.setItem("currentScene", newScene);
  });

  watch(currentDialogue, (newDialogue) => {
    localStorage.setItem("currentDialogue", newDialogue.toString());
  });

  watch(firstLoad, () => {
    if (firstLoad.value) {
      localStorage.setItem("firstLoad", "false");
      initialUnlockLevels();
      initialProgress();
      firstLoad.value = false;
    }
  });

  const markSceneAsRead = (scene: string) => {
    if (!readScenes.value.includes(scene)) {
      readScenes.value.push(scene);
      localStorage.setItem("readScenes", JSON.stringify(readScenes.value));
    }
  }

  const resetReadScenes = () => {
    readScenes.value = [];
    localStorage.setItem("readScenes", JSON.stringify(readScenes.value));
  }

  const initialProgress = () => {
    if (!firstLoad.value) return;
    currentLevel.value = "level0";
    currentScene.value = "scene1";
    currentDialogue.value = 0;
    readScenes.value = [];
    firstLoad.value = false;
  }

  return { firstLoad ,currentLevel, currentScene, currentDialogue, readScenes, markSceneAsRead, resetReadScenes, initialProgress  };
}
