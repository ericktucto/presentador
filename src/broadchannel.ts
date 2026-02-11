import { onMounted, onUnmounted } from 'vue';

// EVENTS
export enum WebRTCEvent {
    offer = 'OFFER',
    ice = 'ICE',
    answer = 'ANSWER',
}
export enum PresentadorEvent {
    live = 'PRESENTADOR@LIVE',
    delete = 'PRESENTADOR@DELETE',
    previous = 'PRESENTADOR@PREVIOUS',
    next = 'PRESENTADOR@NEXT',
    play = 'PRESENTADOR@PLAY',
    stop = 'PRESENTADOR@STOP',
    pause = 'PRESENTADOR@PAUSE',
    go = 'PRESENTADOR@GO',
    change = 'PRESENTADOR@CHANGE',
    updateTime = 'PRESENTADOR@UPDATE_TIME',
}
export enum ReproductorEvent {
    load = 'REPRODUCTOR@load',
}

export interface WebRTCEventMap {
    [WebRTCEvent.offer]: { offer: RTCSessionDescriptionInit }
    [WebRTCEvent.answer]: { answer: RTCSessionDescriptionInit }
    [WebRTCEvent.ice]: { candidate: RTCIceCandidateInit | null }
}
export interface PresentadorEventMap {
    [PresentadorEvent.live]: { url: string, type: 'image' | 'video' }
    [PresentadorEvent.delete]: { url: string }
    [PresentadorEvent.previous]: {}
    [PresentadorEvent.next]: {}
    [PresentadorEvent.play]: { url: string }
    [PresentadorEvent.stop]: { url: string }
    [PresentadorEvent.pause]: { url: string }
    [PresentadorEvent.go]: { url: string, time: number }
    [PresentadorEvent.updateTime]: { video: 'main' | 'aux', url: string, time: number }
    [PresentadorEvent.change]: { url: string }
}

export interface ReproductorEventMap {
    [ReproductorEvent.load]: { url: string }
}

type GlobalEventMap =
    & PresentadorEventMap
    & ReproductorEventMap
    & WebRTCEventMap

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
