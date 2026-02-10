import { defineStore } from "pinia";
import { type ArchivoInterface } from "../../domain/models/Archivo";

interface State {
    playing: ArchivoInterface | null
    paused: boolean
}

export const useMediaStreamStore = defineStore("mediastream", {
    state: (): State => ({
        playing: null,
        paused: false,
    }),
    actions: {
        setPlaying(f: ArchivoInterface | null) {
            this.playing = f
            this.paused = false
        },
    }
});

