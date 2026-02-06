<script setup lang="ts"></script>
<template>
    <div class="p-6 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
                <div class="text-primary">
                    <v-icon name="md-permmedia" />
                </div>
                <h1 class="text-lg font-bold tracking-tight">Presentation Hub</h1>
            </div>
            <button
                class="text-slate-400 hover:text-slate-100 transition-colors cursor-pointer hover:bg-slate-300/50 p-2 rounded-full size-10">
                <v-icon name="io-settings-outline" />
            </button>
        </div>
        <div class="relative">
            <v-icon name="md-search-round"
                class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]" />
            <input
                class="w-full bg-white dark:bg-slate-800/50 border-none rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-primary placeholder:text-slate-500"
                placeholder="Search assets..." type="text">
        </div>
    </div>
</template>
