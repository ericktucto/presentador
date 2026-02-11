import { onMounted } from "vue";
import { useBroadcastChannel, WebRTCEvent } from "../../broadchannel";
import { useLiveStore } from "../stores/live";

export function useLive() {
    const liveStore = useLiveStore()
    const { listen, trigger } = useBroadcastChannel();
    const pc = new RTCPeerConnection()

    function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
        return new Promise(resolve => {
            if (video.readyState >= 2) {
                resolve()
            } else {
                video.onloadedmetadata = () => resolve()
            }
        })
    }

    function getStream(video: HTMLVideoElement, url: string, typeFile: "image" | "video"): Promise<MediaStream | undefined> {
        return new Promise(async (resolve) => {
            if (typeFile === 'video') {
                await waitForVideoReady(video)

                resolve(video.captureStream?.() ?? video.mozCaptureStream?.())
            }
            const canvas = document.createElement('canvas')

            const img = new Image()
            img.onload = () => {
                const ctx = canvas.getContext('2d')!
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                resolve(canvas.captureStream(1))
            }

            img.src = url

        })
    }

    async function live(video: HTMLVideoElement, url: string, typeFile: "image" | "video") {
        const stream = await getStream(video, url, typeFile)
        if (!stream) {
            liveStore.setLive('')
            return;
        }

        stream.getTracks().forEach(track => pc.addTrack(track, stream))

        const offer = await pc.createOffer()
        pc.setLocalDescription(offer)

        trigger(WebRTCEvent.offer, { offer })


        pc.onicecandidate = e => {
            trigger(WebRTCEvent.ice, { candidate: e.candidate?.toJSON() ?? null })
        }
        liveStore.setLive(url)
    }

    onMounted(() => {
        listen(WebRTCEvent.answer, (e) => {
            pc.setRemoteDescription(e.data.data.answer)
        })
    })

    return {
        live
    }
}
