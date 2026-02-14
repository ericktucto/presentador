<script setup lang="ts">
import { onMounted } from 'vue';
import PreviewComponent from '../components/PreviewComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import { ProjectEvent, ReproductorEvent, useBroadcastChannel } from '../../broadchannel';

const { trigger, listen } = useBroadcastChannel();

onMounted(() => {
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
