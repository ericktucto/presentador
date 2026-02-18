import { fileToBase64 } from "../../utils/image";

export class Settings {
    public name: string;
    public profile: string;
    public lang: string;
    constructor() {
        this.name = localStorage.getItem('name') || '';
        this.profile = localStorage.getItem('profile') || ''
        this.lang = localStorage.getItem('lang') || 'en'
    }

    async applyFileToProfile(file: File) {
        this.profile = await fileToBase64(file)
    }

    save() {
        localStorage.setItem('name', this.name);
        localStorage.setItem('profile', this.profile);
        localStorage.setItem('lang', this.lang);
    }
}
