<script setup lang="ts">
import { computed, onMounted, ref, toRaw, watch } from 'vue';
import { useFilesStore } from '../../stores/files';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel';
import { Archivo } from '../../../domain/models/Archivo';
import { useLiveStore } from '../../stores/live';
import { useMediaStream } from '../../composables/mediastream';
import { formatSecondsToMMSS } from '../../../utils/mediaplay';
import { useMediaStreamStore } from '../../stores/mediastream';
import { useLegend } from '../../composables/legend';

const filesStore = useFilesStore()
const liveStore = useLiveStore();
const mediaStreamStore = useMediaStreamStore()
const { trigger, listen } = useBroadcastChannel()

const archivo = computed(() => filesStore.currentSelected)
const { total } = useLegend(archivo);
const { isPlaying, percentage } = useMediaStream(archivo)
const time = ref(0)

const isStartIndex = computed(() => {
    if (!archivo.value) {
        return undefined
    }
    const index = filesStore.files.findIndex(f => archivo.value && f.isMe(archivo.value))
    return index === 0
})
const isEndIndex = computed(() => {
    if (!archivo.value) {
        return undefined
    }
    const index = filesStore.files.findIndex(f => archivo.value && f.isMe(archivo.value))
    return (index + 1) === filesStore.files.length
})

function onClick() {
    if (archivo.value instanceof Archivo) {
        trigger(
            PresentadorEvent.live,
            {
                url: toRaw(archivo.value.url), type: archivo.value.isPlayable ? 'video' : 'image',
            })
    }
}
watch(() => isPlaying.value, (newValue) => {
    if (!newValue) {
        time.value = 0
    }
})
function handlePlayOrPause() {
    if (archivo.value instanceof Archivo) {
        // continue or play
        if (!isPlaying.value || (isPlaying.value && mediaStreamStore.paused)) {
            trigger(PresentadorEvent.play, { url: toRaw(archivo.value.url) })
            return;
        }
        trigger(PresentadorEvent.pause, { url: archivo.value.url })
    }
}
function handleStop() {
    if (archivo.value instanceof Archivo) {
        trigger(PresentadorEvent.stop, { url: archivo.value.url })
    }
}
const bar = ref<HTMLDivElement | null>(null)
function handleClickBar(e: PointerEvent) {
    if (archivo.value instanceof Archivo && bar.value) {
        const target = e.target as HTMLDivElement
        const mouseX = e.clientX - target.getBoundingClientRect().left;
        const time = (total.value * mouseX) / bar.value.clientWidth
        trigger(PresentadorEvent.go, { url: archivo.value.url, time })
    }
}
function handleNext() {
    if (archivo.value instanceof Archivo) {
        trigger(PresentadorEvent.next, {})
    }
}
function handlePrevious() {
    if (archivo.value instanceof Archivo) {
        trigger(PresentadorEvent.previous, {})
    }
}
onMounted(() => {
    listen(PresentadorEvent.updateTime, (e) => {
        time.value = archivo.value?.isMe(e.data.data.url) ? e.data.data.time : 0
    })
})
</script>
<template>
    <div class="media-controls bg-white dark:bg-[#0d141b] flex flex-col">
        <div class="media-controls__bar w-full transition-all easy-linear duration-200 bg-slate-100 dark:bg-slate-800 relative group cursor-pointer"
            :class="[archivo?.isPlayable ? 'block' : 'hidden']" @click="handleClickBar" ref="bar">
            <div class="absolute inset-y-0 left-0 bg-primary
            transition-[width] duration-200 ease-linear" :style="{ width: `${percentage(total, time)}%` }"></div>
            <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
        </div>
        <div class="px-8 py-5 flex items-center justify-between">
            <div class="flex items-center gap-4 w-1/4">
                <div
                    class="flex items-center bg-slate-50 dark:bg-slate-900/50 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
                    <button
                        class="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
                        :disabled="!archivo || filesStore.files.length < 2 || isStartIndex" @click="handlePrevious"
                        title="Previous">
                        <v-icon name="md-skipprevious-round" />
                    </button>
                    <button
                        class="p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer"
                        :disabled="!archivo || filesStore.files.length < 2 || isEndIndex" @click="handleNext"
                        title="Next">
                        <v-icon name="md-skipnext-round" />
                    </button>
                </div>
                <span class="text-xs font-mono font-bold text-slate-500" v-show="archivo?.isPlayable">{{
                    formatSecondsToMMSS(time) }} /
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
                        <v-icon
                            :name="!isPlaying || (isPlaying && mediaStreamStore.paused) ? 'md-playarrow-round' : 'md-pause-round'" />
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
<style scoped>
.media-controls>.media-controls__bar {
    height: 2px;
}

.media-controls:hover>.media-controls__bar {
    height: 12px;
}
</style>
