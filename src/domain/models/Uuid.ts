export interface UuidInterface {
    toString(): string;
}
export class Uuid implements UuidInterface {
    readonly id: string;
    constructor(id?: string) {
        this.id = id ?? crypto.randomUUID();
    }

    toString(): string {
        return this.id;
    }

    static fromString(id: string): Uuid {
        return new Uuid(id);
    }
}
