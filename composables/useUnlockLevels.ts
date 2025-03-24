export function useUnlockLevels() {
  const unlockLevel = async (currentLevel: string) => {
    const storedLevels = localStorage.getItem("unlockedLevels");
    let unlocked: string[] = Array.isArray(storedLevels) ? JSON.parse(storedLevels) : [];

    // 確保當前關卡被標記為解鎖
    if (!unlocked.includes(currentLevel)) {
      unlocked.push(currentLevel);
    }

    try {
      // 讀取 script.json，獲取最新的關卡解鎖資訊
      const response = await fetch("/data/script.json");
      const script = await response.json();
      const currentUnlocks = script.levels?.[currentLevel]?.unlocks ?? [];

      // 確保 `currentUnlocks` 是陣列，然後進行解鎖
      if (Array.isArray(currentUnlocks)) {
        currentUnlocks.forEach((level: string) => {
          if (!unlocked.includes(level)) {
            unlocked.push(level);
          }
        });
      }

      // 更新 LocalStorage，確保最新的解鎖進度儲存
      localStorage.setItem("unlockedLevels", JSON.stringify(unlocked));
    } catch (error) {
      console.error("讀取關卡數據失敗:", error);
    }
  };

  return { unlockLevel };
}
