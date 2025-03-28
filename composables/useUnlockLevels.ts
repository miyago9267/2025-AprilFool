export function useUnlockLevels() {
  const unlockLevel = async (nextLevel: string) => {
    const storedLevels = localStorage.getItem("unlockedLevels");
    let unlockedRaw = storedLevels ? JSON.parse(storedLevels) : [];

    // 確保當前關卡被標記為解鎖
    unlockedRaw.push(nextLevel);

    // 去重
    let unlocked = Array.from(new Set(unlockedRaw.flat()));
    localStorage.setItem("unlockedLevels", JSON.stringify(unlocked));
  };

  const initialUnlockLevels = async () => {
    const initialLevels = ["level0"];
    localStorage.setItem("unlockedLevels", JSON.stringify(initialLevels));
  }

  return { unlockLevel, initialUnlockLevels };
}
