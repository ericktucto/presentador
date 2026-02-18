<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PresentadorEvent, ReproductorEvent, useBroadcastChannel, WebRTCEvent } from '../../../broadchannel'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

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
        if (
            pc.connectionState === "closed" || pc.connectionState === "failed" || pc.connectionState === "disconnected"
        ) {
            pc.close()
            pc = null
            loopConnection();
        }
    }
    return con
}

const connecting = ref(false)
function loopConnection() {
    if (connecting.value) {
        return;
    }
    connecting.value = true
    const interval = setInterval(() => {
        if (pc instanceof RTCPeerConnection && pc.connectionState === 'connected') {
            clearInterval(interval);
            connecting.value = false
            return;
        }
        trigger(ReproductorEvent.requestConnection, {
            uuid: uuid.value
        })
    }, 500)
}

onMounted(() => {
    loopConnection();

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
        if (videoRef.value) {
            videoRef.value.srcObject = null
        }
    })
});

const videoRef = ref<HTMLVideoElement | null>(null)
</script>
<template>
    <div class="bg-center flex bg-no-repeat bg-contain size-full items-center justify-center relative">
        <div role="status"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-black/50 rounded-lg"
            :class="[connecting ? 'flex flex-col items-center gap-2' : 'hidden']">
            <svg aria-hidden="true" class="size-8 text-neutral-tertiary animate-spin fill-brand block"
                viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="white" />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="var(--color-primary)" />
            </svg>
            <span class="text-sm text-white">{{ t('connecting') }}...</span>
        </div>
        <video ref="videoRef"
            class="object-contain landscape:h-screen landscape:w-auto portrait:w-screen portrait:h-auto" autoplay
            playsinline></video>
    </div>
</template>
