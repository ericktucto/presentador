import { defineStore } from "pinia";
import type { ArchivoInterface } from "../../domain/models/Archivo";

interface State {
    live: string | null
    currentStream: MediaStream | null
}

export const useLiveStore = defineStore("live", {
    state: (): State => ({
        live: null,
        currentStream: null
    }),
    actions: {
        setLive(url: string | null, mediaStream: MediaStream | null = null) {
            this.live = url
            this.currentStream = mediaStream
        },
        isLive(archivo: ArchivoInterface | null | undefined) {
            if (!archivo) {
                return false
            }
            return this.live === archivo.url
        },
    }
});
