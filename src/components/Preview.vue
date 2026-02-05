<script setup lang="ts">
import { computed, toRaw } from 'vue';
import { useFilesStore } from '../stores/files';
import { useModoStore } from '../stores/modo';
import { PresentadorEvent, useBroadcastChannel } from '../broadchannel';
import { Archivo } from '../domain/models/Archivo';

const { trigger } = useBroadcastChannel()

const archivo = computed(() => useFilesStore().currentSelected)
const legend = computed(() => {
    if (!archivo.value) {
        return '';
    }
    if (
        archivo.value.file.type.startsWith("image/")
    ) {
        return "Image";
    }
    if (archivo.value.file.type.startsWith("video/")) {
        return `Video • ${archivo.value.duration.toString()}`;
    }
    return "Archivo";
})
function onClick() {
    if (archivo.value instanceof Archivo) {
        trigger(PresentadorEvent.show, { url: toRaw(archivo.value.url) })
    }
}
</script>
<template>
    <section class="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden relative">
        <div
            class="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111921]">
            <div v-if="!archivo"></div>
            <div v-else class="flex items-center gap-4">
                <span class="material-symbols-outlined text-primary">movie</span>
                <div>
                    <h2 class="text-sm font-bold leading-none mb-1">{{ archivo.name }}</h2>
                    <p class="text-[10px] text-slate-500">{{ legend }}</p>
                </div>
            </div>
            <div class="flex items-center gap-1.5">
                <button
                    class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[20px]">share</span>
                </button>
                <button
                    class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[20px]">download</span>
                </button>
                <button @click="onClick"
                    class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
                <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                <button
                    class="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    @click="useModoStore().change(null)">
                    <v-icon name="fa-exchange-alt" /> Cambiar
                </button>
            </div>
        </div>
        <div class="flex-1 flex items-center justify-center p-12 bg-[#0d141b]">
            <div
                class="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group/player border border-slate-800">
                <div v-if="archivo" class="bg-center bg-no-repeat bg-contain size-full"
                    :style="{ backgroundImage: `url('${archivo.url}')` }">
                </div>
            </div>
        </div>
        <div
            class="px-8 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111921] flex items-center justify-center gap-8">
            <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Resolution</span>
                <span class="text-xs font-semibold">3840 x 2160</span>
            </div>
            <div class="h-4 w-px bg-slate-800"></div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Format</span>
                <span class="text-xs font-semibold">ProRes 422</span>
            </div>
            <div class="h-4 w-px bg-slate-800"></div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Size</span>
                <span class="text-xs font-semibold">1.2 GB</span>
            </div>
        </div>
    </section>
</template>
