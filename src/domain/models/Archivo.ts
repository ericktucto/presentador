import { Uuid, type UuidInterface } from "./Uuid";

export interface ArchivoInterface {
    id: Uuid;
    name: string;
    url: string;
    type: string;
    file: File;
    isMe(id: UuidInterface): boolean;
}

export class Archivo implements ArchivoInterface {
    constructor(
        public id: Uuid,
        public name: string,
        public url: string,
        public type: string,
        public file: File,
    ) {
    }

    public isMe(id: Uuid): boolean {
        return this.id.toString() === id.toString();
    }

    public static fromFile(file: File): Archivo {
        return new Archivo(new Uuid(), file.name, URL.createObjectURL(file), file.type, file);
    }
}
