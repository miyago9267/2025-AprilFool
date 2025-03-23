export async function fetchLevelIndex() {
	const index: { levels: Record<string, { src: string }> } = await $fetch("/data/script.json");
	return index.levels || {};
}

export async function fetchLevelScript(levelId: string) {
	const index = await fetchLevelIndex();
	const levelMeta = index[levelId];

	if (!levelMeta?.src) {
		throw new Error(`關卡 ${levelId} 的 script 無法找到`);
	}

	return await $fetch(levelMeta.src);
}