import { onMounted, onUnmounted } from 'vue';
import type { UuidInterface } from './domain/models/Uuid';

// EVENTS
export enum PresentadorEvent {
    show = 'PRESENTADOR@SHOW'
}
export enum ReproductorEvent {
    load = 'REPRODUCTOR@load'
}

export interface PresentadorEventMap {
    [PresentadorEvent.show]: { url: string, uuid: string }
}

export interface ReproductorEventMap {
    [ReproductorEvent.load]: { uuid: string }
}

type GlobalEventMap =
    & PresentadorEventMap
    & ReproductorEventMap

type GlobalEvent = keyof GlobalEventMap

type ListenedEvent<E extends GlobalEvent> = {
    type: E
    data: GlobalEventMap[E]
}

export function useBroadcastChannel() {
    const channel = new BroadcastChannel('auth_channel');

    function trigger<E extends GlobalEvent>(event: E, data: GlobalEventMap[E]) {
        channel.postMessage({ type: event, data });
    }

    const listeners: { [key: string]: Array<(e: MessageEvent) => void> } = {};
    function listen<E extends GlobalEvent>(
        event: E,
        callback: (e: MessageEvent<ListenedEvent<E>>) => void
    ) {
        if (Array.isArray(listeners[event])) {
            listeners[event].push(callback);
            return;
        }
        listeners[event] = [callback];
    }

    onMounted(() => {
        channel.onmessage = (event) => {
            const listener = listeners[event.data.type];
            if (Array.isArray(listener)) {
                listener.forEach((callback) => callback(event));
            }
        };
    });

    onUnmounted(() => {
        channel.close(); // Limpieza importante
    });

    return { trigger, listen };
}
