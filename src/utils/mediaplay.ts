import type { Archivo } from "../domain/models/Archivo";

export function duracionTotal(file: Archivo): Promise<number> {
    return new Promise((resolve) => {
        const media = document.createElement('video');
        media.src = file.url;
        media.onloadedmetadata = () => {
            resolve(media.duration) // en segundos
        };
    })
}

export function formatSecondsToMMSS(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const minutesStr = String(mins).padStart(2, "0");
    const secondsStr = String(secs).padStart(2, "0");

    return `${minutesStr}:${secondsStr}`;
}

