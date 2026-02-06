<script setup lang="ts">
import { computed } from 'vue';
import { useFilesStore } from '../../stores/files'
import { useLegend } from '../../composables/legend';

const archivo = computed(() => useFilesStore().currentSelected)
const { legend } = useLegend(archivo)
</script>
<template>
    <div
        class="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d141b] min-h-[68px]">
        <div class="flex items-center gap-4">
            <div v-if="archivo">
                <h2 class="text-sm font-bold leading-none mb-1">{{ archivo.name }}</h2>
                <div class="flex items-center gap-2">
                    <span class="size-1.5 bg-live rounded-full"></span>
                    <p class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{{ legend }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
