<script setup lang="ts">
import { onMounted } from 'vue';
import { ReproductorEvent, useBroadcastChannel } from '../../broadchannel';
import PreviewComponent from '../components/PreviewComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import { Uuid } from '../../domain/models/Uuid';
import { useLiveStore } from '../stores/live';

const { listen } = useBroadcastChannel()
const liveStore = useLiveStore()
onMounted(() => {
    listen(ReproductorEvent.load, (e) => {
        liveStore.setLive(Uuid.fromString(e.data.data.uuid));
    });
});
</script>
<template>
    <main class="flex flex-1 overflow-hidden">
        <SidebarComponent />
        <PreviewComponent />
    </main>
</template>
