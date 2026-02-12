<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFilesStore } from '../../stores/files';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel';
import { useMediaStream } from '../../composables/mediastream';
import { useLive } from '../../composables/live';
import { useLiveStore } from '../../stores/live';

const filesStore = useFilesStore()
const liveStore = useLiveStore()
const archivo = computed(() => filesStore.currentSelected)

const { trigger, listen } = useBroadcastChannel();
const { live } = useLive()

const videoRef = ref<HTMLVideoElement | null>(null)
const videoAux = ref<HTMLVideoElement | null>(null)
const { play, stop, pause, isPlaying, poster, go, isStarting } = useMediaStream(archivo);

function onUpdatedTimeMain() {
    const video = usarMain.value ? videoRef.value : videoAux.value
    if (video) {
        trigger(PresentadorEvent.updateTime, {
            video: 'main',
            time: video.currentTime,
            url: video.src
        })
    }
}
function onPause() {
    if (archivo.value) {
        trigger(PresentadorEvent.pause, { url: archivo.value.url })
    }
}

onMounted(() => {
    listen(PresentadorEvent.next, () => {
        if (!(liveStore.live && usarMain.value)) {
            stop(usarMain.value ? videoRef : videoAux)
        }
        filesStore.next()
    })
    listen(PresentadorEvent.previous, () => {
        if (!(liveStore.live && usarMain.value)) {
            stop(usarMain.value ? videoRef : videoAux)
        }
        filesStore.previous()
    })
    listen(PresentadorEvent.delete, (e) => {
        const { url } = e.data.data
        if (isPlaying.value && archivo.value && archivo.value.isMe(url)) {
            stop(videoRef)
        }
        filesStore.delete(url)
    })
    listen(PresentadorEvent.play, () => {
        play(usarMain.value ? videoRef : videoAux)
    })
    listen(PresentadorEvent.stop, () => {
        stop(usarMain.value ? videoRef : videoAux)
    })
    listen(PresentadorEvent.pause, () => {
        pause(usarMain.value ? videoRef : videoAux)
    })
    listen(PresentadorEvent.go, (e) => {
        go(usarMain.value ? videoRef : videoAux, e.data.data.time)
    })
    listen(PresentadorEvent.live, (e) => {
        if (videoRef.value) {
            stop(videoRef)
            live(videoRef.value, e.data.data.url, e.data.data.type)
            if (e.data.data.type === 'video') {
                play(videoRef)
            }
        }
    })
    listen(PresentadorEvent.change, (e) => {
        if (archivo.value) {
            if (!liveStore.isLive(archivo.value)) {
                stop(liveStore.live ? videoAux : videoRef)
            }
        }
        filesStore.select(e.data.data.url)
    })
})
const usarMain = computed(() => {
    return !liveStore.live || (liveStore.live && liveStore.isLive(archivo.value) && archivo.value?.isPlayable)
})
</script>
<template>
    <div class="flex-1 flex items-center justify-center p-12 bg-[#0d141b]">
        <div
            class="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group/player border border-slate-800">
            <div v-if="archivo && !archivo.isPlayable" class="bg-center bg-no-repeat bg-contain size-full"
                :style="{ backgroundImage: `url('${archivo.url}')` }">
            </div>
            <!-- video to live -->
            <video :poster="poster" ref="videoRef" v-show="usarMain" class="w-full h-full object-cover"
                @timeupdate="onUpdatedTimeMain" @pause="onPause"></video>
            <!-- video to playing (aux - when is live) -->
            <video :poster="poster" ref="videoAux" v-show="!usarMain && isStarting(archivo)"
                class="w-full h-full object-cover" @timeupdate="onUpdatedTimeMain" @pause="onPause" muted></video>
            <div v-if="!isPlaying" class="bg-center bg-no-repeat bg-contain size-full"
                :style="{ backgroundImage: `url('${poster}')` }">
            </div>
        </div>
    </div>
</template>
