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


    async function live(video: HTMLVideoElement, url: string) {
        await waitForVideoReady(video)

        const stream =
            video.captureStream?.() ??
            video.mozCaptureStream?.()

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
