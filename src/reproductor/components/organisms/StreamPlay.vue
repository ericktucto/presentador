<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PresentadorEvent, ReproductorEvent, useBroadcastChannel, WebRTCEvent } from '../../../broadchannel'

const uuid = ref<string>(crypto.randomUUID());

const { listen, trigger } = useBroadcastChannel()

let pc: RTCPeerConnection | null = null

function createPeerConnection() {
    const con = new RTCPeerConnection()
    con.addTransceiver("video", { direction: "recvonly" })
    con.addTransceiver("audio", { direction: "recvonly" })

    con.ontrack = e => {
        if (videoRef.value) {
            videoRef.value.srcObject = e.streams[0] ?? null
        }
    }
    con.onconnectionstatechange = () => {
        if (!pc) {
            return;
        }
        if (pc.connectionState === 'connected') {
            console.log("DEBUG: Connected")
        }
        if (pc.connectionState === "closed" || pc.connectionState === "failed") {
            pc = null
        }
        trigger(ReproductorEvent.requestConnection, { uuid: uuid.value })
    }
    return con
}

onMounted(() => {
    trigger(ReproductorEvent.requestConnection, {
        uuid: uuid.value
    })

    listen(WebRTCEvent.offer, async (e) => {
        if (uuid.value !== e.data.data.uuid) {
            return;
        }
        if (!pc) {
            pc = createPeerConnection()
        }
        await pc.setRemoteDescription(e.data.data.offer)
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        trigger(WebRTCEvent.answer, { answer, uuid: uuid.value })
    })
    listen(WebRTCEvent.ice, async (e) => {
        if (uuid.value !== e.data.data.uuid) {
            return;
        }
        if (!pc) {
            return;
        }
        await pc.addIceCandidate(e.data.data.candidate)
    })
    listen(PresentadorEvent.endLive, () => {
        console.log("Hola erick")
        if (videoRef.value) {
            videoRef.value.srcObject = null
        }
    })
});

const videoRef = ref<HTMLVideoElement | null>(null)

const tipo = ref<'image' | 'video'>('image')
const media = ref('')
</script>
<template>
    <div v-if="media && tipo === 'image'" class="bg-center bg-no-repeat bg-contain size-full"
        :style="{ backgroundImage: `url('${media}')` }">
    </div>
    <div class="bg-center flex bg-no-repeat bg-contain size-full items-center justify-center">
        <video ref="videoRef"
            class="object-contain landscape:h-screen landscape:w-auto portrait:w-screen portrait:h-auto" autoplay
            playsinline></video>
    </div>
</template>
