<script setup lang="ts">
import PreviewHeader from './organisms/PreviewHeader.vue';
import LocalPreview from './organisms/LocalPreview.vue';
import MediaControls from './organisms/MediaControls.vue';
</script>
<template>
    <section class="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden relative">
        <PreviewHeader />
        <LocalPreview />
        <MediaControls />
    </section>
</template>
