import { onMounted, onUnmounted } from 'vue';
import type { MediaType } from './types';

// EVENTS
export enum WebRTCEvent {
    offer = 'OFFER',
    ice = 'ICE',
    answer = 'ANSWER',
}
export enum ProjectEvent {
    isAllowedPresentador = 'PROJECT@IS_ALLOWED_PRESENTADOR',
    presentadorIsDeny = 'PRESENTADOR@PRESENTADOR_IS_DENY',
    closeAllPresentador = 'PRESENTADOR@CLOSE_ALL_PRESENTADOR',
}
export enum PresentadorEvent {
    live = 'PRESENTADOR@LIVE',
    endLive = 'PRESENTADOR@END_LIVE',
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
    load = 'REPRODUCTOR@LOAD',
    requestConnection = 'REPRODUCTOR@REQUEST_CONNECTION',
}

// MAPPERS
export interface WebRTCEventMap {
    [WebRTCEvent.offer]: { offer: RTCSessionDescriptionInit, uuid: string }
    [WebRTCEvent.answer]: { answer: RTCSessionDescriptionInit, uuid: string }
    [WebRTCEvent.ice]: { candidate: RTCIceCandidateInit | null, uuid: string }
}
export interface ProjectEventMap {
    [ProjectEvent.isAllowedPresentador]: {}
    [ProjectEvent.presentadorIsDeny]: {}
    [ProjectEvent.closeAllPresentador]: { except: string }
}
export interface PresentadorEventMap {
    [PresentadorEvent.live]: { url: string, type: MediaType }
    [PresentadorEvent.delete]: { url: string }
    [PresentadorEvent.previous]: {}
    [PresentadorEvent.next]: {}
    [PresentadorEvent.play]: { url: string }
    [PresentadorEvent.stop]: { url: string }
    [PresentadorEvent.pause]: { url: string }
    [PresentadorEvent.go]: { url: string, time: number }
    [PresentadorEvent.updateTime]: { video: 'main' | 'aux', url: string, time: number }
    [PresentadorEvent.change]: { url: string }
    [PresentadorEvent.endLive]: {}
}

export interface ReproductorEventMap {
    [ReproductorEvent.load]: { url: string }
    [ReproductorEvent.requestConnection]: { uuid: string }
}

type GlobalEventMap =
    & PresentadorEventMap
    & ReproductorEventMap
    & WebRTCEventMap
    & ProjectEventMap

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
