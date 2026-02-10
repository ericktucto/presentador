<script setup lang="ts">
import { computed, toRaw, toRef } from 'vue';
import { useFilesStore } from '../../stores/files';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel';
import { Archivo } from '../../../domain/models/Archivo';
import { useLiveStore } from '../../stores/live';
import { useMediaStreamStore } from '../../stores/mediastream';
import { useMediaStream } from '../../composables/mediastream';

const filesStore = useFilesStore()
const liveStore = useLiveStore();
const { trigger } = useBroadcastChannel()

const archivo = computed(() => filesStore.currentSelected)
const { isPlaying } = useMediaStream(archivo)

function onClick() {
    if (archivo.value instanceof Archivo) {
        trigger(PresentadorEvent.show, { url: toRaw(archivo.value.url), uuid: archivo.value.id.toString() })
    }
}
function handlePlayOrPause() {
    if (archivo.value instanceof Archivo) {
        // continue or play
        if (isPlaying.value) {
            trigger(PresentadorEvent.play, { url: toRaw(archivo.value.url), uuid: archivo.value.id.toString() })
            return;
        }
        trigger(PresentadorEvent.pause, { uuid: archivo.value.id.toString() })
    }
}
function handleStop() {
    if (archivo.value instanceof Archivo) {
        trigger(PresentadorEvent.stop, { uuid: archivo.value.id.toString() })
    }
}
</script>
<template>
    <div class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d141b] flex flex-col">
        <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 relative group cursor-pointer">
            <div class="absolute inset-y-0 left-0 bg-primary w-1/3 transition-all"></div>
            <div
                class="absolute top-1/2 left-1/3 -translate-y-1/2 size-4 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white dark:border-slate-900">
            </div>
            <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
        </div>
        <div class="px-8 py-5 flex items-center justify-between">
            <div class="flex items-center gap-4 w-1/4">
                <div
                    class="flex items-center bg-slate-50 dark:bg-slate-900/50 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
                    <button
                        class="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
                        title="Previous">
                        <v-icon name="md-skipprevious-round" />
                    </button>
                    <button
                        class="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
                        title="Next">
                        <v-icon name="md-skipnext-round" />
                    </button>
                </div>
                <span class="text-xs font-mono font-bold text-slate-500" v-show="archivo?.isPlayable">01:00 /
                    03:45</span>
            </div>
            <div class="flex-1 items-center justify-center" :class="[archivo?.isPlayable ? 'flex' : 'hidden']">
                <div
                    class="flex items-center bg-slate-50 dark:bg-slate-900/50 rounded-full p-1 border border-slate-200 dark:border-slate-800 gap-2">
                    <button
                        class="size-12 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        @click="handleStop" title="Stop">
                        <v-icon name="md-stop-round" />
                    </button>
                    <button
                        class="size-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        @click="handlePlayOrPause" title="Play Master">
                        <v-icon :name="isPlaying ? 'md-pause-round' : 'md-playarrow-round'" />
                    </button>
                </div>
            </div>
            <div class="flex items-center gap-6 justify-end w-1/4">
                <div class="flex items-center gap-3">
                    <button class="text-slate-400 hover:text-slate-200 transition-colors" title="Toggle Local Audio">
                        <v-icon name="bi-volume-down-fill" />
                    </button>
                    <div class="w-20 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full w-2/3 bg-primary"></div>
                    </div>
                </div>
                <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                <button
                    class="flex items-center gap-2 bg-live text-white px-8 py-2.5 rounded-lg font-black text-sm tracking-widest uppercase live-glow hover:scale-[1.02] active:scale-95 transition-all"
                    :class="[archivo && liveStore.isLive(archivo) ? 'bg-[#EF4444]' : 'bg-gray-400']" @click="onClick">
                    <span class="size-2.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></span>
                    LIVE
                </button>
            </div>
        </div>
    </div>
</template>
