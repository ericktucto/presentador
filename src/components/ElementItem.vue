<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { Archivo } from '../domain/models/Archivo';
import { useFilesStore } from '../stores/files';

const filesStore = useFilesStore()

const props = defineProps({
    archivo: {
        type: Object as PropType<Archivo>,
        required: true
    }
})
const legend = computed(() => {
    if (
        props.archivo.file.type.startsWith("image/")
    ) {
        return "Image";
    }
    if (props.archivo.file.type.startsWith("video/")) {
        return `Video • ${props.archivo.duration.toString()}`;
    }
    return "Archivo";
})
function onSelect() {
    filesStore.select(props.archivo.id)
}
</script>
<template>
    <div class="flex items-center gap-3 px-4 py-3 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border-l-3 border-transparent"
        @click="onSelect">
        <div
            class="relative size-12 rounded bg-white flex-shrink-0 overflow-hidden border border-slate-300 dark:border-slate-700">
            <img alt="Image thumbnail" class="w-full h-full object-cover" :src="archivo.url">
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-xs font-medium truncate">{{ archivo.name }}</p>
            <p class="text-[10px] text-slate-500">{{ legend }}</p>
        </div>
    </div>
</template>
