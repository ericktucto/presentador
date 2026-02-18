import { fileToBase64 } from "../../utils/image";

export class Settings {
    public name: string;
    public profile: string;
    constructor() {
        this.name = localStorage.getItem('name') || '';
        this.profile = localStorage.getItem('profile') || ''
    }

    async applyFileToProfile(file: File) {
        this.profile = await fileToBase64(file)
    }

    save() {
        localStorage.setItem('name', this.name);
        localStorage.setItem('profile', this.profile);
    }
}
