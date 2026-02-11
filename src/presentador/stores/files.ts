import { defineStore } from "pinia";
import { Archivo, type ArchivoInterface } from "../../domain/models/Archivo";

interface State {
    files: ArchivoInterface[],
    selected: string | null,
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
        delete(url: string) {
            if (this.selected?.toString() === url) {
                const index = this.files.findIndex(f => f.isMe(url));
                this.selected = this.files[index - 1]?.url ?? null
            }
            this.files = this.files.filter(f => !f.isMe(url));
        },
        select(url: string) {
            this.selected = url
        },
        next() {
            if (this.selected) {
                const index = this.files.findIndex(f => this.selected && f.isMe(this.selected));
                const newSelected = this.files[index + 1]
                if (newSelected) {
                    this.selected = newSelected.url
                }
            }
        },
        previous() {
            if (this.selected) {
                const index = this.files.findIndex(f => this.selected && f.isMe(this.selected));
                const newSelected = this.files[index - 1]
                console.log(newSelected)
                if (newSelected) {
                    this.selected = newSelected.url
                }
            }
        },
    }
});
