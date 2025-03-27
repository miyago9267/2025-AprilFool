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

  watch(currentLevel, (newLevel) => {
    localStorage.setItem("currentLevel", newLevel);
  });

  watch(currentScene, (newScene) => {
    localStorage.setItem("currentScene", newScene);
  });

  watch(currentDialogue, (newDialogue) => {
    localStorage.setItem("currentDialogue", newDialogue.toString());
  });

  const markSceneAsRead = (scene: string) => {
    if (!readScenes.value.includes(scene)) {
      readScenes.value.push(scene);
      localStorage.setItem("readScenes", JSON.stringify(readScenes.value));
    }
  }

  const resetScenes = () => {
    currentDialogue.value = 0;
    resetReadScenes();
  }

  const resetReadScenes = () => {
    readScenes.value = [];
    localStorage.setItem("readScenes", JSON.stringify(readScenes.value));
  }

  return { currentLevel, currentScene, currentDialogue, readScenes, markSceneAsRead, resetScenes, resetReadScenes };
}
