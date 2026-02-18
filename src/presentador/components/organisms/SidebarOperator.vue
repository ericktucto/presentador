<script setup lang="ts">
import { useSettingsStore } from '../../../stores/settings';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const settingsStore = useSettingsStore()

</script>
<template>
    <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80">
        <div class="flex items-center gap-3">
            <div
                class="size-10 rounded-full border-2 border-primary overflow-hidden bg-slate-200 flex items-center justify-center">
                <span v-show="!settingsStore.settings?.profile">
                    <v-icon name="fa-user-alt" v-show="!settingsStore.settings?.profile" />
                </span>
                <img class="w-full h-full object-cover" v-show="settingsStore.settings?.profile"
                    :src="settingsStore.settings?.profile || ''">
            </div>
            <div class="flex-1">
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{{ t('operator') }}</p>
                <p class="text-[10px] text-primary font-bold tracking-wider underline no-select cursor-pointer"
                    @click="settingsStore.setModal(true)" v-if="!settingsStore.settings?.name">
                    Click aquí para configurar nombre <v-icon class="size-[12px]" name="md-openinnew-round" /></p>
                <p class="text-xs font-black tracking-tight uppercase" v-else>{{ settingsStore.settings?.name }}</p>
            </div>
        </div>
        <div class="bg-black/20 dark:bg-black/40 rounded-lg p-3 mt-4" v-if="false">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <v-icon name="md-headphones-round" />
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Headphone Volume</span>
                </div>
                <span class="text-[10px] font-mono text-primary">75%</span>
            </div>
            <div class="flex items-center gap-2">
                <v-icon name="bi-volume-down-fill" />
                <input class="flex-1 h-1" max="100" min="0" type="range" value="75">
                <v-icon name="bi-volume-up-fill" />
            </div>
        </div>
    </div>
</template>
