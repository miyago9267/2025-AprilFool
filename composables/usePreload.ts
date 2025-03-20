import { ref } from "vue";

export function usePreload() {
  const loading = ref(true);
  const progress = ref(0);
  const fakeLoadingDelay = 3000; // 額外延遲 3 秒

  // 自動載入 `/public/images/` 資料夾內所有圖片
  const imagesToPreload = ref<string[]>([]);
  const imagePaths = import.meta.glob("/public/images/**/*.{jpg,jpeg,png,gif,webp}");

  Object.keys(imagePaths).forEach((path) => {
    imagesToPreload.value.push(path.replace("/public", ""));
  });

  const preloadImages = async (extraImages: string[] = []) => {
    let allImages = [...imagesToPreload.value, ...extraImages];
    let loadedCount = 0;

    const startTime = Date.now();

    for (const path of allImages) {
      await new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          loadedCount++;
          progress.value = Math.round((loadedCount / allImages.length) * 100);
          resolve(undefined);
        };
        img.onerror = resolve;
      });
    }

    // 確保載入時間至少 3 秒
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < fakeLoadingDelay) {
      await new Promise(resolve => setTimeout(resolve, fakeLoadingDelay - elapsedTime));
    }

    loading.value = false;
  };

  return {
    loading,
    progress,
    preloadImages,
  };
}
