<template>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-black p-4 shadow-lg z-10">
        <div class="grid grid-cols-3 grid-rows-3 gap-1">
            <div v-for="(tile, index) in tiles" :key="index" class="w-20 h-20 bg-gray-300 flex items-center justify-center text-lg cursor-pointer" :class="{ 'bg-white cursor-default': tile === 0 }"
                @click="move(index)">
                <span v-if="tile !== 0">{{ tile }}</span>
            </div>
        </div>
        <div class="mt-2 text-center">
            <button class="bg-blue-500 text-white px-4 py-1 rounded" @click="shuffle">打亂</button>
            <div v-if="isWin" class="mt-2 font-bold text-green-600">你完成拼圖了！</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(["interaction-success"])
const tiles = ref<number[]>([])
const size = 3

const isWin = computed(() => {
    for (let i = 0; i < 8; i++) {
        if (tiles.value[i] !== i + 1) return false
    }
    return tiles.value[8] === 0
})

function init() {
    shuffle()
}

function shuffle() {
    do {
        tiles.value = [...Array(8).keys()].map(i => i + 1).concat(0)
        for (let i = tiles.value.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const tempI = tiles.value[i] ?? 0
            const tempJ = tiles.value[j] ?? 0
            tiles.value[i] = tempJ
            tiles.value[j] = tempI
        }
    } while (!isSolvable(tiles.value))
}

function isSolvable(arr: number[]) {
    let inv = 0
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] !== undefined && arr[j] !== undefined && arr[i]! > arr[j]!) inv++
        }
    }
    return inv % 2 === 0
}

function move(index: number) {
    const empty = tiles.value.indexOf(0)
    const row = Math.floor(empty / size)
    const col = empty % size

    const targetRow = Math.floor(index / size)
    const targetCol = index % size

    const isAdjacent =
      (Math.abs(row - targetRow) === 1 && col === targetCol) ||
      (Math.abs(col - targetCol) === 1 && row === targetRow)

    if (isAdjacent) {
      const tempEmpty = tiles.value[empty] ?? 0
      const tempIndex = tiles.value[index] ?? 0
      tiles.value[empty] = tempIndex
      tiles.value[index] = tempEmpty
      
      if (isWin.value) {
          emit("interaction-success")
      }
    }
}

init()
</script>

<style scoped>
</style>