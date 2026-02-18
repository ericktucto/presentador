<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "../../../stores/settings";
import { Settings } from "../../../domain/models/Settings";

const { t } = useI18n()
const settingsStore = useSettingsStore()

const inputImage = ref<HTMLImageElement | null>(null)
const settings = ref<Settings>(new Settings())
function handleClickProfile() {
    inputImage.value?.click()
}
async function handleProfile(e: Event) {
    const target = e.target as HTMLInputElement
    if (!target.files || !target.files[0]) return
    settings.value.applyFileToProfile(target.files[0])
}
function handleSave() {
    settingsStore.save(settings.value)
    settingsStore.setModal(false)
}
</script>
<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
            class="bg-white dark:bg-[#0d141b] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 class="text-sm mb-0 font-bold uppercase tracking-widest">{{ t('settings') }}</h3>
                <button @click="settingsStore.setModal(false)"
                    class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer hover:bg-slate-200/50 rounded-full size-10">
                    <v-icon name="md-close-round" />
                </button>
            </div>
            <div class="p-6 space-y-6">
                <div class="space-y-2">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{{
                        t('operatorName') }}</label>
                    <input
                        class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        style="text-transform: uppercase;" type="text" v-model="settings.name">
                </div>
                <div class="space-y-4">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{{
                        t('operatorImage') }}</label>
                    <div class="flex items-center gap-6">
                        <div
                            class="relative size-20 rounded-full overflow-hidden border-2 border-primary bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span v-show="!settings.profile">
                                <v-icon name="fa-user-alt" v-show="!settings.profile" />
                            </span>
                            <img class="w-full h-full object-cover" v-show="settings.profile" :src="settings.profile">
                        </div>
                        <div class="flex flex-col gap-2">
                            <button @click="handleClickProfile"
                                class="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded transition-colors flex items-center gap-2">
                                <v-icon name="md-upload-round" />
                                <input type="file" class="hidden" ref="inputImage" @change="handleProfile" />
                                {{ t('newImage') }}
                            </button>
                            <p class="text-[10px] text-slate-500">JPG / PNG. Max 1MB.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="px-6 py-4 bg-slate-50 dark:bg-[#080c10] border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button @click="settingsStore.setModal(false)"
                    class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors hover:bg-slate-200/50 border border-slate-200 dark:border-slate-800 rounded">
                    {{ t('cancel') }}
                </button>
                <button @click="handleSave"
                    class="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded shadow-lg shadow-primary/20 transition-all">
                    {{ t('saveChanges') }}
                </button>
            </div>
        </div>
    </div>
</template>
