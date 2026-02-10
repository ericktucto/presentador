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
        setFilter(f: string) {
            this.filter = f;
        },
        add(fl: FileList) {
            Array.from(fl)
                .forEach(
                    (f) => this.files.push(Archivo.fromFile(f))
                );
        },
        delete(id: UuidInterface) {
            if (this.selected?.toString() === id.toString()) {
                const index = this.files.findIndex(f => f.isMe(id));
                this.selected = this.files[index - 1]?.id ?? null
            }
            this.files = this.files.filter(f => !f.isMe(id));
        },
        select(id: UuidInterface) {
            this.selected = id;
        },
        next() {
            if (this.selected) {
                const index = this.files.findIndex(f => this.selected && f.isMe(this.selected));
                const newSelected = this.files[index + 1]
                if (newSelected) {
                    this.selected = newSelected.id
                }
            }
        },
        previous() {
            if (this.selected) {
                const index = this.files.findIndex(f => this.selected && f.isMe(this.selected));
                const newSelected = this.files[index - 1]
                console.log(newSelected)
                if (newSelected) {
                    this.selected = newSelected.id
                }
            }
        },
    }
});
