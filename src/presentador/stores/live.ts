import { defineStore } from "pinia";
import type { ArchivoInterface } from "../../domain/models/Archivo";

interface State {
    live: string | null
}

export const useLiveStore = defineStore("live", {
    state: (): State => ({
        live: null,
    }),
    actions: {
        setLive(url: string) {
            this.live = url
        },
        isLive(archivo: ArchivoInterface) {
            return this.live === archivo.url
        },
    }
});
