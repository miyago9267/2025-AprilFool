export function useUnlockLevels() {
  const unlockLevel = async (nextLevel: string[]) => {
    const storedLevels = localStorage.getItem("unlockedLevels");
    let unlockedRaw = storedLevels ? JSON.parse(storedLevels) : [];
    let unlocked = Array.from(new Set(unlockedRaw.flat()));

    // 確保當前關卡被標記為解鎖

    for (const level of nextLevel) {
      if (!unlocked.includes(level)) {
        unlocked.push(level);
      }
    }

    try {
      localStorage.setItem("unlockedLevels", JSON.stringify(unlocked));
    } catch (error) {
      console.error("讀取關卡數據失敗:", error);
    }
  };

  return { unlockLevel };
}
