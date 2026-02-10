<script setup lang="ts"></script>
<template>
    <div class="mt-auto p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80">
        <div class="flex items-center gap-3">
            <div class="size-10 rounded-full border-2 border-primary overflow-hidden bg-slate-200">
                <img alt="ERICK TUCTO" class="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIhOXv-RpiosJCmEYATLh22fCabK5U8qRSCIir0rF3XgnaeUF7tK-r4Z-luVplTmf50dcV8KkTr6vHNM1RlCbedGXkwxV9nwHd_jaqkqN7mtXqzLCE4ZgV1sjxzCoufNtW-yH_L1N7fzLncmp2kzXU1y1ler9JKu9Bdgd7y18oKwPj13QRNX8a0JyTe-_wrzzkrVv1VwQ82yfKr1U54h69kuVsuaZ44JXmym3KkVhZd6v5Eb62WYlGfB5xw5S3FOYttqBKIIG_oR-m">
            </div>
            <div class="flex-1">
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Operator</p>
                <p class="text-xs font-black tracking-tight uppercase">ERICK TUCTO</p>
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
