import { onMounted } from "vue";
import { useBroadcastChannel, WebRTCEvent } from "../../broadchannel";
import { useLiveStore } from "../stores/live";

export function useLive() {
    const liveStore = useLiveStore()
    const { listen, trigger } = useBroadcastChannel();
    const peers: Map<string, RTCPeerConnection> = new Map()

    function createPeerConnection(uuid: string): RTCPeerConnection {
        const con = new RTCPeerConnection()
        con.onconnectionstatechange = () => {
            if (
                con.connectionState === "failed" ||
                con.connectionState === "closed"
            ) {
                console.log("Closing connection...")
                con.close()
                peers.delete(uuid)
            }
        }

        con.onnegotiationneeded = async () => {
            if (con.signalingState !== "stable") return

            const offer = await con.createOffer()
            await con.setLocalDescription(offer)

            trigger(WebRTCEvent.offer, { offer, uuid })
        }

        con.onicecandidate = e => {
            trigger(WebRTCEvent.ice, { candidate: e.candidate?.toJSON() ?? null, uuid })
        }
        return con
    }

    function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
        return new Promise(resolve => {
            if (video.readyState >= 2) {
                resolve()
            } else {
                video.addEventListener('loadedmetadata', () => resolve(), { once: true })
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

    async function connect(uuid: string) {
        if (peers.has(uuid)) return

        const pc = createPeerConnection(uuid)
        pc.createDataChannel('control')

        peers.set(uuid, pc)

        if (liveStore.currentStream) {
            liveStore.currentStream.getTracks().forEach(track => {
                pc.addTrack(track, liveStore.currentStream!)
            })
        }

        console.log("DEBUG: New connection", uuid)
        console.log("DEBUG: Actived connections", peers.size)
    }

    async function live(video: HTMLVideoElement, url: string, typeFile: "image" | "video") {
        if (peers.size === 0) {
            return;
        }
        const stream = await getStream(video, url, typeFile)
        if (!stream) {
            liveStore.setLive('')
            return;
        }

        peers.forEach(pc => {
            stream.getTracks().forEach(track => {
                const sender = pc.getSenders().find(
                    s => s.track?.kind === track.kind
                )

                if (sender) {
                    sender.replaceTrack(track)
                } else {
                    pc.addTrack(track, stream)
                }
            })
        })

        liveStore.setLive(url, stream)
    }

    async function off() {
        peers.forEach(pc => {
            pc.getSenders().forEach(sender => {
                if (sender.track?.kind === "video") {
                    sender.replaceTrack(null)
                }
                if (sender.track?.kind === "audio") {
                    sender.replaceTrack(null)
                }
            })
        })
        if (liveStore.live) {
            liveStore.setLive('')
        }
    }

    onMounted(() => {
        listen(WebRTCEvent.answer, (e) => {
            const pc = peers.get(e.data.data.uuid)
            // send message: no exist presentador
            if (!pc) {
                return;
            }
            pc.setRemoteDescription(e.data.data.answer)
        })
    })

    return {
        live,
        connect,
        off,
    }
}
