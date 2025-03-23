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

  function markSceneAsRead(level: string, scene: string) {
    const key = `${level}:${scene}`;
    if (!readScenes.value.includes(key)) {
      readScenes.value.push(key);
      localStorage.setItem("readScenes", JSON.stringify(readScenes.value));
    }
  }

  return { currentLevel, currentScene, currentDialogue, readScenes, markSceneAsRead };
}
