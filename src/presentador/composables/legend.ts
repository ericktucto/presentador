import { ref, type Ref, watch } from "vue";
import type { Archivo } from "../../domain/models/Archivo";
import { duracionTotal, formatSecondsToMMSS } from "../../utils/mediaplay";
import { useI18n } from "vue-i18n";
import { MediaType } from "../../types";

export function useLegend(archivo: Ref<Archivo | null | undefined>) {
    const { t } = useI18n()

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
            a.mediaType === MediaType.image
        ) {
            legend.value = t('image');
            return;
        }
        if (a.mediaType === MediaType.video || a.mediaType === MediaType.audio) {
            const tiempo = await duracionTotal(a)
            if (!cancelled) {
                legend.value = `${t(a.mediaType === MediaType.video ? 'video' : 'audio')} • ${formatSecondsToMMSS(tiempo)}`;
                total.value = tiempo
            }
            return;
        }
        legend.value = t('file');
    }, { immediate: true })
    return { legend, total }
}
