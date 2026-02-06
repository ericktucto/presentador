import { defineStore } from "pinia";
import { Archivo, type ArchivoInterface } from "../../domain/models/Archivo";
import type { UuidInterface } from "../../domain/models/Uuid";

interface State {
    files: ArchivoInterface[],
    selected: UuidInterface | null,
    filter: string
}

export const useFilesStore = defineStore("files", {
    state: (): State => ({
        files: [],
        selected: null,
        filter: '',
    }),
    getters: {
        currentSelected: (state) => {
            if (!state.selected) {
                return undefined;
            }
            return state.files.find((f) => state.selected && f.isMe(state.selected))
        },
        fileList: (state) => {
            if (!state.filter) {
                return state.files;
            }
            const search = state.filter.toLowerCase();
            return state.files.filter(
                (f) => f.name.toLowerCase().includes(search) || f.file.type.toLowerCase().includes(search)
            )
        }
    },
    actions: {
        add(fl: FileList) {
            Array.from(fl)
                .forEach(
                    (f) => this.files.push(Archivo.fromFile(f))
                );
        },
        select(id: UuidInterface) {
            this.selected = id;
        }
    }
});
