<script setup lang="ts">
import { Archivo } from '../../../domain/models/Archivo';
import { useFilesStore } from '../../stores/files';
import { useLegend } from '../../composables/legend';
import { computed, ref, toRef } from 'vue';
import { useLiveStore } from '../../stores/live';
import { useMediaStream } from '../../composables/mediastream';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel';

const filesStore = useFilesStore()
const liveStore = useLiveStore()

const props = defineProps<{
    archivo: Archivo
}>()
const archivoRef = toRef(props, 'archivo')
const current = computed(() => filesStore.currentSelected)
const { legend } = useLegend(archivoRef)
const { poster } = useMediaStream(toRef(props.archivo))
const { trigger } = useBroadcastChannel()
function handleDelete() {
    if (liveStore.isLive(props.archivo)) {
        return;
    }
    trigger(PresentadorEvent.delete, { url: props.archivo.url })
}
function onSelect() {
    trigger(PresentadorEvent.change, { url: props.archivo.url })
}
// editting
const editting = ref(false)
function handleSetName(e: Event) {
    const target = e.target as HTMLInputElement
    filesStore.setName(props.archivo, target.value)
}
function handleToggleEditting(e: Event) {
    e.stopPropagation()
    editting.value = !editting.value
}
</script>
<template>
    <div class="flex items-center gap-3 px-4 py-3 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border-l-3"
        :class="[current?.isMe(archivo) ? 'border-primary' : 'border-transparent']" @click="onSelect">
        <div
            class="relative size-12 rounded bg-white flex-shrink-0 overflow-hidden border border-slate-300 dark:border-slate-700">
            <img alt="Image thumbnail" class="w-full h-full object-cover"
                :src="archivo.isPlayable ? poster : archivo.url">
        </div>
        <div class="flex min-w-0 flex-1">
            <div class="flex-1 min-w-0">
                <p class="text-xs font-medium truncate flex w-full justify-between gap-3">
                    <span class="flex gap-2 items-center">
                        <input type="text"
                            class="max-w-[120px] truncate outline-none border-b-[1px] border-b-[#EF4444] border-b-primary"
                            @keypress.enter="editting = false" @click="(e) => e.stopPropagation()" :value="archivo.name"
                            @input="handleSetName" v-show="editting" />
                        <div class="max-w-[120px] inline truncate" v-show="!editting">{{ archivo.name }}</div>
                        <span class="text-primary size-[24px] flex justify-center" @click="handleToggleEditting">
                            <v-icon :name="editting ? 'md-savealt-round' : 'ri-edit-2-line'" />
                        </span>
                    </span>
                    <span
                        class="bg-[#EF4444] text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-tighter uppercase flex items-center gap-1"
                        v-show="liveStore.isLive(archivo)">
                        <v-icon name="md-sensors-round" />
                        LIVE
                    </span>
                </p>
                <p class="text-[10px] text-slate-500">{{ legend }}</p>
            </div>
            <button
                class="hover:bg-[#EF4444]/20 cursor-pointer text-[#EF4444] text-[9px] p-2 rounded font-black tracking-tighter rounded-full flex items-center gap-1"
                v-show="!liveStore.isLive(archivo)" @click="handleDelete">
                <v-icon name="fa-trash-alt" class="size-5" />
            </button>
        </div>
    </div>
</template>
