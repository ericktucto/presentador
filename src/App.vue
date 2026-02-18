<script setup lang="ts">
import { onMounted } from 'vue';
import Pregunta from './components/Pregunta.vue';
import PresentadorView from './presentador/views/Index.vue';
import ReproductorView from './reproductor/views/Index.vue';
import { useModoStore } from './stores/modo';
import { useSettingsStore } from './stores/settings';

const modoStore = useModoStore()
onMounted(() => { useSettingsStore().loadSettings() })

</script>
<template>
    <PresentadorView v-if="modoStore.modo === 'presentador'" />
    <ReproductorView v-if="modoStore.modo === 'reproductor'" />
    <Pregunta v-if="!modoStore.modo" />
</template>

<style scoped></style>
