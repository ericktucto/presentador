export class Uuid {
    private id: string;
    constructor() {
        this.id = crypto.randomUUID();
    }

    toString(): string {
        return this.id;
    }
}
