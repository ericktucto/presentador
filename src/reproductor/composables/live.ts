import { onMounted, ref } from "vue"
import { useBroadcastChannel, WebRTCEvent } from "../../broadchannel";

export function useLive(video: HTMLVideoElement) {
    const { listen, trigger } = useBroadcastChannel();

    const pc = new RTCPeerConnection()
    pc.ontrack = e => {
        video.srcObject = e.streams[0] ?? null
    }

    onMounted(() => {
        listen(WebRTCEvent.offer, async (e) => {
            await pc.setRemoteDescription(e.data.data.offer)
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            trigger(WebRTCEvent.answer, { answer })
        })
        listen(WebRTCEvent.ice, async (e) => {
            await pc.addIceCandidate(e.data.data.candidate)
        })
    })
}
