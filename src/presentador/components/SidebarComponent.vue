<script setup lang="ts">
import SidebarHeader from './organisms/SidebarHeader.vue';
import SidebarPlaylist from './organisms/SidebarPlaylist.vue';
import SidebarOperator from './organisms/SidebarOperator.vue';
</script>
<template>
    <aside class="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d141b] flex flex-col">
        <SidebarHeader />
        <SidebarPlaylist />
        <SidebarOperator />
    </aside>
</template>
