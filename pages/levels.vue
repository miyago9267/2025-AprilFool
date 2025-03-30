<template>
	<div class="w-screen h-screen flex flex-col justify-center items-center text-white relative">
		<div class="background w-full h-full absolute top-0 left-0 z-0" style="
          background-image: url('/images/bg/background_base.png');
          background-size: cover;
          background-position: center;">
		</div>
		<!-- 返回按鈕 -->
		<div class="absolute z-10 top-4 left-4 text-xl text-black px-4 py-2 rounded-xl bg-gray-100 border-2 border-[#823A96] border-solid hover:bg-gray-200 select-none font-text"
			@click="goBack">
			回到開始畫面
		</div>

		<!-- 關卡滾動容器 -->
		<div ref="levelsContainer" class="w-full flex z-10 justify-center items-center"
			:class="isMobile ? 'h-[70vh]' : 'h-[60vh]'">
			<div ref="levelsWrapper"
				class="flex md:h-auto h-full items-start gap-4 py-4 scrollbar-hidden md:flex-row md:overflow-y-scroll flex-col overflow-x-scroll">
				<div v-for="(level, levelId) in filteredLevels" :key="levelId"
					class="w-58 h-30 flex-shrink-0 flex flex-col justify-center items-center rounded-lg text-black text-lg font-bold transition-transform mx-2 border-2 border-[#823A96] border-solid bg-white cursor-pointer hover:scale-105"
					@click="selectLevel(level.id)">
					<span class="font-text text-xl">{{ level.name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { fetchLevelIndex } from "~/composables/useLevelScript";

const router = useRouter();
const route = useRoute();
const levelsContainer = ref(null);
const levels = ref({});
const isMobile = ref(window.innerWidth <= 768); // 判斷是否為手機

const { currentUnlockedLevels } = useGameProgress();
const { initialUnlockLevels } = useUnlockLevels();

// 監聽視窗大小變化，確保正確檢測裝置
const checkDevice = () => {
	isMobile.value = window.innerWidth <= 768;
};
window.addEventListener("resize", checkDevice);

// 讀取關卡數據
const fetchLevels = async () => {
	try {
		const levelIndex = await fetchLevelIndex();
		const levelEntries = Object.entries(levelIndex);

		const results = await Promise.all(
			levelEntries.map(async ([key, { src }]) => {
				try {
					const res = await fetch(src);
					const levelData = await res.json();
					return [key, { ...levelData, id: key }];
				} catch (e) {
					console.warn(`無法載入 ${key} 的腳本：`, e);
					return [key, null];
				}
			})
		);

		levels.value = Object.fromEntries(results.filter(([, v]) => v));
	} catch (error) {
		console.error("載入關卡時發生錯誤：", error);
	}
};

onMounted(() => {
	fetchLevels();
});

onUnmounted(() => {
	window.removeEventListener("resize", checkDevice);
});

// 過濾出已解鎖的關卡

const filteredLevels = computed(() => {
	return Object.entries(levels.value)
		.filter(([key]) => currentUnlockedLevels.value.includes(key))
		.map(([key, value]) => ({
			id: key,
			name: value.name
		}));
});

const selectLevel = (levelId) => {
	if (!currentUnlockedLevels.value.includes(levelId)) return;
	router.push({ path: "/game", query: { level: levelId } });
};

const goBack = () => {
	router.push("/");
};

onActivated(() => {
	if (!window.localStorage.getItem("unlockedLevels")) {
		initialUnlockLevels();
	}
	currentUnlockedLevels.value = JSON.parse(window.localStorage.getItem("unlockedLevels"));
});

</script>

<style scoped>
/* 隱藏滾動條 */
.scrollbar-hidden::-webkit-scrollbar {
	display: none;
}

.scrollbar-hidden {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

</style>