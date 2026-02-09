<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PresentadorEvent, ReproductorEvent, useBroadcastChannel } from '../../../broadchannel'

const { listen, trigger } = useBroadcastChannel()

onMounted(() => {
    listen(PresentadorEvent.show, (e) => {
        media.value = e.data.data.url
        trigger(ReproductorEvent.load, {
            uuid: e.data.data.uuid.toString(),
        })
    });
});

const media = ref('')
</script>
<template>
    <div v-if="media" class="bg-center bg-no-repeat bg-contain size-full"
        :style="{ backgroundImage: `url('${media}')` }">
    </div>
</template>
