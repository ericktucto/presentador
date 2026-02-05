<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useModoStore } from '../stores/modo';
import { PresentadorEvent, useBroadcastChannel } from '../broadchannel';

const { listen } = useBroadcastChannel()

onMounted(() => {
    listen(PresentadorEvent.show, (e) => {
        media.value = e.data.data.url
    });
});

const media = ref('')
</script>
<template>
    <main class="flex flex-1 overflow-hidden w-screen h-screen bg-black">
        <nav
            class="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111921] absolute top-[-100%] transition-all duration-300 w-full w-full">
            <div class="flex items-center gap-1.5">
                <button
                    class="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    @click="useModoStore().change(null)">
                    <v-icon name="fa-exchange-alt" /> Cambiar
                </button>
            </div>
        </nav>
        <div v-if="media" class="bg-center bg-no-repeat bg-contain size-full"
            :style="{ backgroundImage: `url('${media}')` }">
        </div>
    </main>
</template>
<style>
main:hover nav {
    top: 0;
}
</style>
