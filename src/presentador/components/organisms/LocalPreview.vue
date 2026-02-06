<script setup lang="ts">
import { computed } from 'vue';
import { useFilesStore } from '../../stores/files';

const archivo = computed(() => useFilesStore().currentSelected)
</script>
<template>
    <div class="flex-1 flex items-center justify-center p-12 bg-[#0d141b]">
        <div
            class="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group/player border border-slate-800">
            <div v-if="archivo" class="bg-center bg-no-repeat bg-contain size-full"
                :style="{ backgroundImage: `url('${archivo.url}')` }">
            </div>
        </div>
    </div>
</template>
