<script setup lang="ts">
import Pregunta from './components/Pregunta.vue';
import PresentadorView from './presentador/views/Index.vue';
import ReproductorView from './reproductor/views/Index.vue';
import { useModoStore } from './stores/modo';

const modoStore = useModoStore()

</script>
<template>
    <PresentadorView v-if="modoStore.modo === 'presentador'" />
    <ReproductorView v-if="modoStore.modo === 'reproductor'" />
    <Pregunta v-if="!modoStore.modo" />
</template>

<style scoped></style>
