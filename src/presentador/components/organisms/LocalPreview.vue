<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFilesStore } from '../../stores/files';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel';
import { useMediaStream } from '../../composables/mediastream';
import { useLive } from '../../composables/live';

const filesStore = useFilesStore()
const archivo = computed(() => filesStore.currentSelected)

const { trigger, listen } = useBroadcastChannel();
const { live } = useLive()

const videoRef = ref<HTMLVideoElement | null>(null)
const { play, stop, pause, isPlaying, isStarting, poster, go } = useMediaStream(archivo);

function onUpdatedTimeMain() {
    if (videoRef.value) {
        trigger(PresentadorEvent.updateTime, {
            video: 'main',
            time: videoRef.value.currentTime,
            url: videoRef.value.src
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
        if (isPlaying.value) {
            stop(videoRef)
        }
        filesStore.next()
    })
    listen(PresentadorEvent.previous, () => {
        if (isPlaying.value) {
            stop(videoRef)
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
        play(videoRef)
    })
    listen(PresentadorEvent.stop, () => {
        stop(videoRef)
    })
    listen(PresentadorEvent.pause, () => {
        pause(videoRef)
    })
    listen(PresentadorEvent.go, (e) => {
        go(videoRef, e.data.data.time)
    })
    listen(PresentadorEvent.live, (e) => {
        if (videoRef.value) {
            stop(videoRef)
            live(videoRef.value, e.data.data.url)
            play(videoRef)
        }
    })
})
</script>
<template>
    <div class="flex-1 flex items-center justify-center p-12 bg-[#0d141b]">
        <div
            class="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group/player border border-slate-800">
            <div v-if="archivo && !archivo.isPlayable" class="bg-center bg-no-repeat bg-contain size-full"
                :style="{ backgroundImage: `url('${archivo.url}')` }">
            </div>
            <!-- 1 video to playing and other to live -->
            <video :poster="poster" ref="videoRef" v-show="isStarting(archivo)" class="w-full h-full object-cover"
                @timeupdate="onUpdatedTimeMain" @pause="onPause"></video>
            <div v-if="!isPlaying" class="bg-center bg-no-repeat bg-contain size-full"
                :style="{ backgroundImage: `url('${poster}')` }">
            </div>
        </div>
    </div>
</template>
