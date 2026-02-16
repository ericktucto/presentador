<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PreviewComponent from '../components/PreviewComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import { ProjectEvent, useBroadcastChannel } from '../../broadchannel';

const { trigger, listen } = useBroadcastChannel();
const uuid = ref(crypto.randomUUID())

onMounted(() => {
    trigger(ProjectEvent.closeAllPresentador, { except: uuid.value })
    listen(ProjectEvent.closeAllPresentador, (e) => {
        if (uuid.value !== e.data.data.except) {
            window.location.reload()
        }
    })
    trigger(ProjectEvent.presentadorIsDeny, {})
    listen(ProjectEvent.isAllowedPresentador, () => {
        trigger(ProjectEvent.presentadorIsDeny, {})
    })
})
</script>
<template>
    <main class="flex flex-1 overflow-hidden">
        <SidebarComponent />
        <PreviewComponent />
    </main>
</template>
