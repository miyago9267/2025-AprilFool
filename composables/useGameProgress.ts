export function useGameProgress() {
  const currentScene = useState<string>("currentScene", () => {
    return localStorage.getItem("currentScene") || "scene1";  // 從 LocalStorage 讀取場景
  });

  const currentDialogue = useState<number>("currentDialogue", () => {
    return parseInt(localStorage.getItem("currentDialogue") || "0", 10);
  });

  const readScenes = useState<string[]>("readScenes", () => {
    return JSON.parse(localStorage.getItem("readScenes") || "[]");
  });

  // 監聽變數變更時存入 LocalStorage
  watch(currentScene, (newScene) => {
    localStorage.setItem("currentScene", newScene);
  });

  watch(currentDialogue, (newDialogue) => {
    localStorage.setItem("currentDialogue", newDialogue.toString());
  });

  return { currentScene, currentDialogue, readScenes };
}
