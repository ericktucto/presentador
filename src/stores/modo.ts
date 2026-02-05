import { defineStore } from "pinia";
import type { Modo } from "../types";

export const useModoStore = defineStore("modo", {
    state: () => ({
        modo: null as Modo | null,
    }),
    actions: {
        change(modo: Modo | null) {
            this.modo = modo;
        }
    }
});

