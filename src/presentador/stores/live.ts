import { defineStore } from "pinia";
import type { UuidInterface } from "../../domain/models/Uuid";
import type { ArchivoInterface } from "../../domain/models/Archivo";

interface State {
    live: UuidInterface | null
}

export const useLiveStore = defineStore("live", {
    state: (): State => ({
        live: null,
    }),
    actions: {
        setLive(u: UuidInterface) {
            this.live = u
        },
        isLive(archivo: ArchivoInterface) {
            return this.live && archivo.isMe(this.live)
        },
    }
});
