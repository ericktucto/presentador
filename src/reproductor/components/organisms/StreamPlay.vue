<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useBroadcastChannel, WebRTCEvent } from '../../../broadchannel'

const { listen, trigger } = useBroadcastChannel()

const pc = new RTCPeerConnection()
pc.addTransceiver("video", { direction: "recvonly" })
pc.addTransceiver("audio", { direction: "recvonly" })

pc.ontrack = e => {
    console.log("DEBUG track", e)
    if (videoRef.value) {
        videoRef.value.srcObject = e.streams[0] ?? null
    }
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
        <video ref="videoRef" class="w-full object-cover" autoplay playsinline></video>
    </div>
</template>
