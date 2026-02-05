import { Duration } from "./Duration";
import { Uuid } from "./Uuid";

export class Archivo {
    constructor(
        public id: Uuid,
        public name: string,
        public url: string,
        public type: string,
        public file: File,
    ) {
    }

    get duration(): Duration {
        return new Duration(this);
    }

    public isMe(id: Uuid): boolean {
        return this.id.toString() === id.toString();
    }

    public static fromFile(file: File): Archivo {
        return new Archivo(new Uuid(), file.name, URL.createObjectURL(file), file.type, file);
    }
}
