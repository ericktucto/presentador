import { onMounted, onUnmounted } from 'vue';

// EVENTS
export enum PresentadorEvent {
    show = 'PRESENTADOR@SHOW',
    delete = 'PRESENTADOR@DELETE',
    previous = 'PRESENTADOR@PREVIOUS',
    next = 'PRESENTADOR@NEXT',
    play = 'PRESENTADOR@PLAY',
    stop = 'PRESENTADOR@STOP',
    pause = 'PRESENTADOR@PAUSE',
    go = 'PRESENTADOR@GO',
    updateTime = 'PRESENTADOR@UPDATE_TIME',
}
export enum ReproductorEvent {
    load = 'REPRODUCTOR@load',
}

export interface PresentadorEventMap {
    [PresentadorEvent.show]: { url: string, uuid: string }
    [PresentadorEvent.delete]: { uuid: string }
    [PresentadorEvent.previous]: {}
    [PresentadorEvent.next]: {}
    [PresentadorEvent.play]: { url: string, uuid: string }
    [PresentadorEvent.stop]: { uuid: string }
    [PresentadorEvent.pause]: { uuid: string }
    [PresentadorEvent.go]: { uuid: string, time: number }
    [PresentadorEvent.updateTime]: { video: 'main' | 'aux', url: string, time: number }
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
