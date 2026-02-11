import { ref, toRaw, watch, type Ref } from "vue";
import type { Archivo } from "../../domain/models/Archivo";
import { computed } from "@vue/reactivity";
import { useMediaStreamStore } from "../stores/mediastream";

type PosterInterface = {
    [key: string]: string
}

export function useMediaStream(archivo: Ref<Archivo | null | undefined>) {
    const mediaStreamStore = useMediaStreamStore()

    const posterStack = ref<PosterInterface>({})
    const poster = computed(() => {
        if (!archivo.value || !posterStack.value[archivo.value.url]) {
            return ''
        }
        return posterStack.value[archivo.value.url]
    })

    const isPlaying = computed(() => {
        if (!archivo.value || !mediaStreamStore.playing) {
            return false;
        }
        return mediaStreamStore.playing.isMe(archivo.value)
    })
    const paused = computed(() => mediaStreamStore.paused)

    function isStarting(archivo: Archivo | null | undefined) {
        return archivo && mediaStreamStore.playing?.isMe(archivo)
    }

    function buildPoster(archivo: Archivo): Promise<string> {
        return new Promise((resolve) => {
            const video = document.createElement('video')
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!

            video.src = archivo.url
            video.muted = true
            video.currentTime = 0

            video.onloadeddata = () => {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                resolve(canvas.toDataURL('image/png'))
            }
        });
    }

    watch(() => archivo.value?.url, async (_url, _prev, onCleanup) => {
        let cancelled = false;
        onCleanup(() => (cancelled = true))

        if (!archivo.value || !archivo.value.isPlayable || posterStack.value[archivo.value.url]) {
            return;
        }
        const p = await buildPoster(archivo.value)
        if (!cancelled) {
            posterStack.value = {
                ...toRaw(posterStack.value),
                [archivo.value.url]: p
            }
        }
    }, { immediate: true })

    function play(video: Ref<HTMLVideoElement | null>) {
        if (video.value && archivo.value) {
            if (video.value.src !== archivo.value?.url) {
                video.value.src = archivo.value?.url
            }
            video.value.play()
            mediaStreamStore.setPlaying(archivo.value);
            mediaStreamStore.paused = false
        }
    }

    function pause(video: Ref<HTMLVideoElement | null>) {
        if (video.value) {
            video.value.pause()
            mediaStreamStore.paused = true
        }
    }

    function stop(video: Ref<HTMLVideoElement | null>) {
        if (video.value) {
            video.value.pause()
            video.value.currentTime = 0
            video.value.load()
            mediaStreamStore.setPlaying(null);
        }
    }

    function go(video: Ref<HTMLVideoElement | null>, time: number) {
        if (video.value) {
            video.value.currentTime = time
        }
    }

    function percentage(total: number, current: number) {
        return (current / total) * 100
    }

    return {
        play,
        stop,
        pause,
        poster,
        posterStack,
        isPlaying,
        paused,
        isStarting,
        percentage,
        go,
    }
}
