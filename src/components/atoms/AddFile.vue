<script setup lang="ts">
import { ref } from 'vue';
import { useFilesStore } from '../../stores/files';

const filesStore = useFilesStore()
const input = ref<HTMLInputElement | null>(null)

function onAdd() {
    if (!input.value) {
        return;
    }
    input.value.click();
}

function onLoad(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        filesStore.add(target.files);
    }
    (e.target as HTMLInputElement).value = '';
}
</script>
<template>
    <button
        class="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
        @click="onAdd">
        <v-icon name="md-add-round" />
        Add files
        <input ref="input" type="file" class="hidden" multiple @change="onLoad" />
    </button>
</template>
