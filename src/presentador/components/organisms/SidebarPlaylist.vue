<script setup lang="ts">
import FileList from './FileList.vue';
import AddFile from '../atoms/AddFile.vue';
import { useFilesStore } from '../../stores/files';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
    <div class="flex w-full flex-1 overflow-y-scroll">
        <div class="py-2 w-full flex flex-col">
            <div class="px-4 py-3 flex items-center justify-between">
                <div class="flex items-center gap-2 flex-1">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ t('playlist')
                        }}</span>
                    <span
                        class="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold">{{
                            useFilesStore().fileList.length }}</span>
                </div>
                <AddFile />
            </div>
            <FileList />
        </div>
    </div>
</template>
