<script setup lang="ts">
import Pregunta from './components/Pregunta.vue';
import PresentadorPage from './pages/PresentadorPage.vue';
import ReproductorPage from './pages/ReproductorPage.vue';
import { useModoStore } from './stores/modo';

const modoStore = useModoStore()

</script>
<template>
    <PresentadorPage v-if="modoStore.modo === 'presentador'" />
    <ReproductorPage v-if="modoStore.modo === 'reproductor'" />
    <Pregunta v-if="!modoStore.modo" />
</template>

<style scoped></style>
