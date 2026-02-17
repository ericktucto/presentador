<script setup lang="ts">
import { ref } from 'vue'
import { useFilesStore } from '../../stores/files'
import ElementItem from '../molecules/ElementItem.vue'
const filesStore = useFilesStore()

const draggingIndex = ref<number | null>(null)
function onDragStart(e: DragEvent, index: number) {
    const target = e.currentTarget as HTMLElement
    draggingIndex.value = index

    const clone = target.cloneNode(true) as HTMLElement
    clone.style.position = 'absolute'
    clone.style.top = '-9999px'
    clone.style.left = '-9999px'
    clone.style.pointerEvents = 'none'

    document.body.appendChild(clone)

    const rect = target.getBoundingClientRect()

    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    e.dataTransfer?.setDragImage(clone, offsetX, offsetY)

    setTimeout(() => {
        document.body.removeChild(clone)
    }, 0)
}

function onDragOver(index: number) {
    if (draggingIndex.value === null) return
    if (draggingIndex.value === index) return

    const list = filesStore.fileList
    const draggedItem = list[draggingIndex.value]
    if (!draggedItem) return

    // remover del índice original
    list.splice(draggingIndex.value, 1)

    // insertar en nueva posición
    list.splice(index, 0, draggedItem)

    // actualizar índice actual
    draggingIndex.value = index
}

function onDragEnd() {
    draggingIndex.value = null
}
</script>
<template>
    <div class="overflow-y-scroll">
        <ElementItem v-for="(file, index) in filesStore.fileList" :key="file.url" :archivo="file" draggable="true"
            :class="[draggingIndex === index ? 'dragging' : '']" @dragstart="(e: DragEvent) => onDragStart(e, index)"
            @dragover.prevent="onDragOver(index)" @dragend="onDragEnd" />
    </div>
</template>
<style scoped>
.dragging {
    opacity: 0;
}
</style>
