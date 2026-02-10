<script setup lang="ts">
import { Archivo } from '../../../domain/models/Archivo';
import { useFilesStore } from '../../stores/files';
import { useLegend } from '../../composables/legend';
import { toRef } from 'vue';
import { useLiveStore } from '../../stores/live';
import { useMediaStream } from '../../composables/mediastream';

const filesStore = useFilesStore()
const liveStore = useLiveStore()

const props = defineProps<{
    archivo: Archivo
}>()
const archivoRef = toRef(props, 'archivo')
const { legend } = useLegend(archivoRef)
const { poster } = useMediaStream(toRef(props.archivo))
function onSelect() {
    filesStore.select(props.archivo.id)
}
</script>
<template>
    <div class="flex items-center gap-3 px-4 py-3 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border-l-3"
        :class="[filesStore.currentSelected?.isMe(archivo.id) ? 'border-primary' : 'border-transparent']"
        @click="onSelect">
        <div
            class="relative size-12 rounded bg-white flex-shrink-0 overflow-hidden border border-slate-300 dark:border-slate-700">
            <img alt="Image thumbnail" class="w-full h-full object-cover"
                :src="archivo.isPlayable ? poster : archivo.url">
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-xs font-medium truncate flex w-full justify-between gap-3">
                <span class="truncate">{{ archivo.name }}</span>
                <span
                    class="bg-[#EF4444] text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-tighter uppercase flex items-center gap-1"
                    v-show="liveStore.isLive(archivo)">
                    <v-icon name="md-sensors-round" />
                    LIVE
                </span>
            </p>
            <p class="text-[10px] text-slate-500">{{ legend }}</p>
        </div>
    </div>
</template>
