<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Modo } from '../types';
import { useModoStore } from '../stores/modo';
import { ProjectEvent, useBroadcastChannel } from '../broadchannel';

const { listen, trigger } = useBroadcastChannel();

const selected = ref<Modo | null>(null)
const existsPresentador = ref(false)

function handleChangeSelected(s: Modo | null) {
    if (s === Modo.presentador) {
        trigger(ProjectEvent.isAllowedPresentador, {})
    } else {
        existsPresentador.value = false
    }

    selected.value = s
}
onMounted(() => {
    listen(ProjectEvent.presentadorIsDeny, () => {
        existsPresentador.value = selected.value === Modo.presentador
    })
})
</script>
<template>
    <div class="absolute w-full h-full flex items-center justify-center bg-black/50 top-0">
        <div
            class="bg-white dark:bg-[#162c1e] w-full max-w-[480px] rounded-xl shadow-2xl border border-gray-200 dark:border-[#234832] overflow-hidden">
            <!-- Modal Header -->
            <div class="px-8 pt-8 pb-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-gray-900 dark:text-white text-3xl font-bold tracking-tight">
                        Seleccionar Rol
                    </h1>
                </div>
                <p class="text-gray-500 dark:text-[#92c9a8] mt-2 text-sm">
                    Elige cómo deseas interactuar con la plataforma hoy.
                </p>
            </div>
            <!-- Modal Content -->
            <div class="px-8 py-6">
                <div class="flex flex-col gap-6">
                    <!-- Visual Role Indicators (Custom Cards for better UX) -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="group cursor-pointer p-4 rounded-xl border-2 bg-gray-50 dark:bg-[#1d3a29] hover:border-primary/50 transition-all text-center"
                            :class="{ 'border-[#1980e6] border-solid': selected === Modo.presentador, 'border-transparent': selected !== Modo.presentador }"
                            @click="handleChangeSelected(Modo.presentador)">
                            <div
                                class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary group-hover:scale-110 transition-transform">
                                <v-icon name="md-mic-round" />
                            </div>
                            <span class="text-sm font-medium dark:text-white">Presentador</span>
                        </div>
                        <div class="group cursor-pointer p-4 rounded-xl border-2 bg-gray-50 dark:bg-[#1d3a29] hover:border-primary/50 transition-all text-center"
                            :class="{ 'border-[#1980e6] border-solid': selected === Modo.reproductor, 'border-transparent': selected !== Modo.reproductor }"
                            @click="handleChangeSelected(Modo.reproductor)">
                            <div
                                class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary group-hover:scale-110 transition-transform">
                                <v-icon name="md-playcirclefilled-round" />
                            </div>
                            <span class="text-sm font-medium dark:text-white">Reproductor</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-8" v-show="existsPresentador">
                <div class="alert border border-[#EF4444]/50 bg-[#EF4444]/10 p-3 rounded-lg">
                    <h3 class="text-[#EF4444] text-sm">Ya existe una pestaña como presentador,
                        ¿Deseas
                        usar esta pestaña como presentador?</h3>
                </div>
            </div>
            <!-- Modal Footer (ButtonGroup) -->
            <div class="px-8 pb-8 pt-4 flex flex-col sm:flex-row-reverse gap-3">
                <button
                    class="flex-1 bg-primary hover:bg-opacity-90 text-white hover:cursor-pointer font-bold py-3.5 px-6 rounded-full transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                    @click="useModoStore().change(selected)">
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</template>
