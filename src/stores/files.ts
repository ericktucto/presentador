import { defineStore } from "pinia";
import { Archivo } from "../domain/models/Archivo";
import type { Uuid } from "../domain/models/Uuid";

export const useFilesStore = defineStore("files", {
    state: () => ({
        files: [] as Archivo[],
        selected: null as Uuid | null
    }),
    getters: {
        currentSelected: (state) => {
            if (!state.selected) {
                return undefined;
            }
            return state.files.find((f) => f.isMe(state.selected as Uuid))
        }
    },
    actions: {
        add(files: FileList) {
            Array.from(files)
                .forEach(
                    (f) => this.files.push(Archivo.fromFile(f))
                );
        },
        select(id: Uuid) {
            this.selected = id;
        }
    }
});
