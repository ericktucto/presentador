import { onMounted, onUnmounted } from 'vue';

// EVENTS
export enum PresentadorEvent {
    show = 'PRESENTADOR@SHOW'
}
export enum ReproductorEvent {
    stop = 'REPRODUCTOR@STOP'
}
type BroadcastChannelEvent = PresentadorEvent | ReproductorEvent;
type ListenedEvent<T> = {
    type: BroadcastChannelEvent
    data: T
}

export function useBroadcastChannel() {
    const channel = new BroadcastChannel('auth_channel');

    function trigger<T>(event: BroadcastChannelEvent, data: T) {
        channel.postMessage({ type: event, data });
    }

    const listeners: { [key: string]: Array<(e: MessageEvent) => void> } = {};
    function listen<T>(event: BroadcastChannelEvent, callback: (e: MessageEvent<ListenedEvent<T>>) => void) {
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
