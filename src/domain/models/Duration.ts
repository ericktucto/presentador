import { duracionTotal, formatSecondsToMMSS } from "../../utils/mediaplay";
import type { Archivo } from "./Archivo";

export class Duration {
    private tiempo = 0;
    constructor(file: Archivo) {
        duracionTotal(file).then((tiempo) => this.tiempo = tiempo)
    }

    toString() {
        return formatSecondsToMMSS(this.tiempo);
    }
}
