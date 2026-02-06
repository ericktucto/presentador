<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel'

const { listen } = useBroadcastChannel()

onMounted(() => {
    listen(PresentadorEvent.show, (e) => {
        media.value = e.data.data.url
    });
});

const media = ref('')
</script>
<template>
    <div v-if="media" class="bg-center bg-no-repeat bg-contain size-full"
        :style="{ backgroundImage: `url('${media}')` }">
    </div>
</template>
