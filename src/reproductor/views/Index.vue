<script setup lang="ts">
import StreamHeader from '../components/organisms/StreamHeader.vue';
import StreamPlay from '../components/organisms/StreamPlay.vue';
</script>
<template>
    <main class="flex flex-1 overflow-hidden w-screen h-screen bg-black">
        <StreamHeader class="streamheader" />
        <StreamPlay />
    </main>
</template>
<style>
main:hover .streamheader {
    top: 0;
}
</style>
