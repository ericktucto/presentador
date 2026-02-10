import { ref, type Ref, watch } from "vue";
import type { Archivo } from "../../domain/models/Archivo";
import { duracionTotal, formatSecondsToMMSS } from "../../utils/mediaplay";

export function useLegend(archivo: Ref<Archivo | null | undefined>) {
    const legend = ref('')
    const total = ref(0)

    watch(() => archivo.value?.url, async (_url, _prev, onCleanup) => {
        let cancelled = false;
        onCleanup(() => (cancelled = true))

        const a = archivo.value;

        if (!a) {
            legend.value = '';
            return;
        }
        if (
            a.file.type.startsWith("image/")
        ) {
            legend.value = "Image";
            return;
        }
        if (a.file.type.startsWith("video/")) {
            const tiempo = await duracionTotal(a)
            if (!cancelled) {
                legend.value = `Video • ${formatSecondsToMMSS(tiempo)}`;
                total.value = tiempo
            }
            return;
        }
        legend.value = "Archivo";
    }, { immediate: true })
    return { legend, total }
}
