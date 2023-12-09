import {Client, Store, Invite, Member} from "devland.js";
import {EventEmitter} from "events";

declare module 'devland.js-invites' {
    type global_vanity = {
        code: string,
        uses: number,
    }
    type GlobalCache = {
        invites: Map<string, Store<string, number>>,
        vanity: Map<string, Store<string, number>>,
    }
    export type Awaitable<T> = T | PromiseLike<T>;
    export class InviteLogger extends EventEmitter {
        constructor(client: Client);
        private client: Client;
        private cache: object;

        public on<K extends keyof InviteEvents>(event: K, listener: (...args: InviteEvents[K]) => Awaitable<void>): this;
        public on<S extends string | symbol>(
            event: Exclude<S, keyof InviteEvents>,
            listener: (...args: any[]) => Awaitable<void>,
        ): this;
        public once<K extends keyof InviteEvents>(event: K, listener: (...args: InviteEvents[K]) => Awaitable<void>): this;
        public once<S extends string | symbol>(
            event: Exclude<S, keyof InviteEvents>,
            listener: (...args: any[]) => Awaitable<void>,
        ): this;
        public emit<K extends keyof InviteEvents>(event: K, ...args: InviteEvents[K]): boolean;
        public emit<S extends string | symbol>(event: Exclude<S, keyof InviteEvents>, ...args: unknown[]): boolean;
        public off<K extends keyof InviteEvents>(event: K, listener: (...args: InviteEvents[K]) => Awaitable<void>): this;
        public off<S extends string | symbol>(
            event: Exclude<S, keyof InviteEvents>,
            listener: (...args: any[]) => Awaitable<void>,
        ): this;
        public removeAllListeners<K extends keyof InviteEvents>(event?: K): this;
        public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof InviteEvents>): this;
    }
    interface InviteEvents {
        unknowInvite: [member: Member];
        knowInvite: [member: Member, invite: Invite];
        vanityInvite: [member: Member, vanity: global_vanity];
    }
}