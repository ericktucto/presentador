<script setup lang="ts">
import { computed, toRaw } from 'vue';
import { useFilesStore } from '../../stores/files';
import { PresentadorEvent, useBroadcastChannel } from '../../../broadchannel';
import { Archivo } from '../../../domain/models/Archivo';
import { useModoStore } from '../../../stores/modo';


const { trigger } = useBroadcastChannel()

const archivo = computed(() => useFilesStore().currentSelected)
function onClick() {
    if (archivo.value instanceof Archivo) {
        trigger(PresentadorEvent.show, { url: toRaw(archivo.value.url) })
    }
}
</script>
<template>
    <div
        class="px-8 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111921] flex items-center justify-center gap-8">
        <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Resolution</span>
            <span class="text-xs font-semibold">3840 x 2160</span>
        </div>
        <div class="h-4 w-px bg-slate-800"></div>
        <div class="flex items-center gap-2">
            <button @click="onClick"
                class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-[20px]">delete</span>
            </button>
        </div>
        <div class="h-4 w-px bg-slate-800"></div>
        <div class="flex items-center gap-2">
            <button
                class="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                @click="useModoStore().change(null)">
                <v-icon name="fa-exchange-alt" /> Cambiar
            </button>
        </div>
    </div>
</template>
