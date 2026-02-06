export interface UuidInterface {
    toString(): string;
}
export class Uuid implements UuidInterface {
    readonly id: string;
    constructor() {
        this.id = crypto.randomUUID();
    }

    toString(): string {
        return this.id;
    }
}
