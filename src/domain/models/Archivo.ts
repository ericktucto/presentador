export interface ArchivoInterface {
    name: string;
    url: string;
    type: string;
    file: File;
    isMe(obj: ArchivoInterface | string): boolean;
    isPlayable: boolean
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
        return this.type.startsWith("video/");
    }

    public isMe(obj: ArchivoInterface | string): boolean {
        return this.url === (obj instanceof Archivo ? obj.url : obj);
    }

    public static fromFile(file: File): Archivo {
        return new Archivo(file.name, URL.createObjectURL(file), file.type, file);
    }
}
