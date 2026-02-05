<script setup lang="ts">
import { useFilesStore } from '../stores/files'
import ElementItem from './ElementItem.vue';
const filesStore = useFilesStore()
</script>
<template>
    <ElementItem v-for="file in filesStore.files" :key="file.id.toString()" :archivo="file" />
</template>
