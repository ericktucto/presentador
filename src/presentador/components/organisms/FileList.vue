<script setup lang="ts">
import { useFilesStore } from '../../stores/files'
import ElementItem from '../molecules/ElementItem.vue'
const filesStore = useFilesStore()
</script>
<template>
    <ElementItem v-for="file in filesStore.fileList" :key="file.url" :archivo="file" />
</template>
