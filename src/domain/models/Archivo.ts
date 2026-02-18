import { MediaType } from "../../types";

export interface ArchivoInterface {
    name: string;
    url: string;
    type: string;
    file: File;
    isMe(obj: ArchivoInterface | string): boolean;
    isPlayable: boolean
    mediaType: MediaType
}

export class Archivo implements ArchivoInterface {
    constructor(
        public name: string,
        public url: string,
        public type: string,
        public file: File,
    ) {
    }

    get isPlayable() {
        return this.type.startsWith("video/") || this.type.startsWith("audio/");
    }

    get mediaType() {
        if (this.type.startsWith("video/")) {
            return MediaType.video
        }
        if (this.type.startsWith("audio/")) {
            return MediaType.audio
        }
        if (this.type.startsWith("image/")) {
            return MediaType.image
        }
        return MediaType.unknown
    }

    public isMe(obj: ArchivoInterface | string): boolean {
        return this.url === (obj instanceof Archivo ? obj.url : obj);
    }

    public static fromFile(file: File): Archivo {
        return new Archivo(file.name, URL.createObjectURL(file), file.type, file);
    }
}
