<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFilesStore } from '../../stores/files';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel';
import { useMediaStream } from '../../composables/mediastream';

const archivo = computed(() => useFilesStore().currentSelected)

const { trigger, listen } = useBroadcastChannel();

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
        trigger(PresentadorEvent.pause, { uuid: archivo.value?.id.toString() })
    }
}

onMounted(() => {
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
