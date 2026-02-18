import { defineStore } from "pinia";
import { Settings } from "../domain/models/Settings";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        settings: null as Settings | null,
        showModal: false,
    }),
    actions: {
        setModal(value: boolean) {
            this.showModal = value
        },
        loadSettings() {
            this.settings = new Settings()
        },
        save(modo: Settings | null) {
            this.settings = modo;
            this.settings?.save()
        }
    }
});

