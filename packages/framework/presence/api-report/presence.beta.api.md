## Beta API Report File for "@fluidframework/presence"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @beta @sealed
export interface Attendee<SpecificAttendeeId extends AttendeeId = AttendeeId> {
    readonly attendeeId: SpecificAttendeeId;
    getConnectionId(): ClientConnectionId;
    getConnectionStatus(): AttendeeStatus;
}

// @beta
export type AttendeeId = SessionId & {
    readonly AttendeeId: "AttendeeId";
};

// @beta @sealed
export interface AttendeesEvents {
    // @eventProperty
    attendeeConnected: (attendee: Attendee) => void;
    // @eventProperty
    attendeeDisconnected: (attendee: Attendee) => void;
}

// @beta
export const AttendeeStatus: {
    readonly Connected: "Connected";
    readonly Disconnected: "Disconnected";
};

// @beta
export type AttendeeStatus = (typeof AttendeeStatus)[keyof typeof AttendeeStatus];

// @beta @sealed
export interface BroadcastControls {
    allowableUpdateLatencyMs: number | undefined;
}

// @beta
export interface BroadcastControlSettings {
    readonly allowableUpdateLatencyMs?: number;
}

// @beta
export type ClientConnectionId = string;

// @beta
export const getPresence: (fluidContainer: IFluidContainer) => Presence;

// @beta @system
export namespace InternalTypes {
    // @system
    export type ManagerFactory<TKey extends string, TValue extends ValueDirectoryOrState<any>, TManager> = {
        instanceBase: new (...args: any[]) => any;
    } & ((key: TKey, datastoreHandle: StateDatastoreHandle<TKey, TValue>) => {
        initialData?: {
            value: TValue;
            allowableUpdateLatencyMs: number | undefined;
        };
        manager: StateValue<TManager>;
    });
    // @system (undocumented)
    export interface MapValueState<T, Keys extends string | number> {
        // (undocumented)
        items: {
            [name in Keys]: ValueOptionalState<T>;
        };
        // (undocumented)
        rev: number;
    }
    // @system (undocumented)
    export interface NotificationType {
        // (undocumented)
        args: unknown[];
        // (undocumented)
        name: string;
    }
    // @system (undocumented)
    export class StateDatastoreHandle<TKey, TValue extends ValueDirectoryOrState<any>> {
    }
    // @system
    export type StateValue<T> = T & StateValueBrand<T>;
    // @system
    export class StateValueBrand<T> {
    }
    // @system (undocumented)
    export interface ValueDirectory<T> {
        // (undocumented)
        items: {
            [name: string | number]: ValueOptionalState<T> | ValueDirectory<T>;
        };
        // (undocumented)
        rev: number;
    }
    // @system (undocumented)
    export type ValueDirectoryOrState<T> = ValueRequiredState<T> | ValueDirectory<T>;
    // @system
    export interface ValueOptionalState<TValue> extends ValueStateMetadata {
        // (undocumented)
        value?: OpaqueJsonDeserialized<TValue>;
    }
    // @system
    export interface ValueRequiredState<TValue> extends ValueStateMetadata {
        // (undocumented)
        value: OpaqueJsonDeserialized<TValue>;
    }
    // @system (undocumented)
    export interface ValueStateMetadata {
        // (undocumented)
        rev: number;
        // (undocumented)
        timestamp: number;
    }
}

// @beta
export function latest<T extends object | null, Key extends string = string>(args: LatestArguments<T>): InternalTypes.ManagerFactory<Key, InternalTypes.ValueRequiredState<T>, LatestRaw<T>>;

// @beta @input
export interface LatestArguments<T extends object | null> {
    local: JsonSerializable<T>;
    settings?: BroadcastControlSettings | undefined;
}

// @beta @sealed
export interface LatestClientData<T> extends LatestData<T> {
    attendee: Attendee;
}

// @beta @sealed
export interface LatestData<T> {
    metadata: LatestMetadata;
    value: DeepReadonly<JsonDeserialized<T>>;
}

// @beta
export function latestMap<T, Keys extends string | number = string | number, RegistrationKey extends string = string>(args?: LatestMapArguments<T, Keys>): InternalTypes.ManagerFactory<RegistrationKey, InternalTypes.MapValueState<T, Keys>, LatestMapRaw<T, Keys>>;

// @beta @input
export interface LatestMapArguments<T, Keys extends string | number = string | number> {
    local?: {
        [K in Keys]: JsonSerializable<T>;
    };
    settings?: BroadcastControlSettings | undefined;
}

// @beta @sealed
export interface LatestMapClientData<T, Keys extends string | number, SpecificAttendeeId extends AttendeeId = AttendeeId> {
    attendee: Attendee<SpecificAttendeeId>;
    items: ReadonlyMap<Keys, LatestData<T>>;
}

// @beta @sealed
export interface LatestMapItemRemovedClientData<K extends string | number> {
    attendee: Attendee;
    key: K;
    metadata: LatestMetadata;
}

// @beta @sealed
export interface LatestMapItemUpdatedClientData<T, K extends string | number> extends LatestClientData<T> {
    key: K;
}

// @beta @sealed
export interface LatestMapRaw<T, Keys extends string | number = string | number> {
    readonly controls: BroadcastControls;
    readonly events: Listenable<LatestMapRawEvents<T, Keys>>;
    getRemote(attendee: Attendee): ReadonlyMap<Keys, LatestData<T>>;
    getRemotes(): IterableIterator<LatestMapClientData<T, Keys>>;
    getStateAttendees(): Attendee[];
    readonly local: StateMap<Keys, T>;
    readonly presence: Presence;
}

// @beta @sealed
export interface LatestMapRawEvents<T, K extends string | number> {
    // @eventProperty
    localItemRemoved: (removedItem: {
        key: K;
    }) => void;
    // @eventProperty
    localItemUpdated: (updatedItem: {
        value: DeepReadonly<JsonSerializable<T>>;
        key: K;
    }) => void;
    // @eventProperty
    remoteItemRemoved: (removedItem: LatestMapItemRemovedClientData<K>) => void;
    // @eventProperty
    remoteItemUpdated: (updatedItem: LatestMapItemUpdatedClientData<T, K>) => void;
    // @eventProperty
    remoteUpdated: (updates: LatestMapClientData<T, K>) => void;
}

// @beta @sealed
export interface LatestMetadata {
    revision: number;
    timestamp: number;
}

// @beta @sealed
export interface LatestRaw<T> {
    readonly controls: BroadcastControls;
    readonly events: Listenable<LatestRawEvents<T>>;
    getRemote(attendee: Attendee): LatestData<T>;
    getRemotes(): IterableIterator<LatestClientData<T>>;
    getStateAttendees(): Attendee[];
    get local(): DeepReadonly<JsonDeserialized<T>>;
    set local(value: JsonSerializable<T>);
    readonly presence: Presence;
}

// @beta @sealed
export interface LatestRawEvents<T> {
    // @eventProperty
    localUpdated: (update: {
        value: DeepReadonly<JsonSerializable<T>>;
    }) => void;
    // @eventProperty
    remoteUpdated: (update: LatestClientData<T>) => void;
}

// @beta @sealed
export interface Presence {
    // (undocumented)
    readonly attendees: {
        readonly events: Listenable<AttendeesEvents>;
        getAttendees(): ReadonlySet<Attendee>;
        getAttendee(clientId: ClientConnectionId | AttendeeId): Attendee;
        getMyself(): Attendee;
    };
    readonly events: Listenable<PresenceEvents>;
    // (undocumented)
    readonly states: {
        getWorkspace<StatesSchema extends StatesWorkspaceSchema>(workspaceAddress: WorkspaceAddress, requestedStates: StatesSchema, controls?: BroadcastControlSettings): StatesWorkspace<StatesSchema>;
    };
}

// @beta @sealed
export interface PresenceEvents {
    workspaceActivated: (workspaceAddress: WorkspaceAddress, type: "States" | "Notifications" | "Unknown") => void;
}

// @beta
export const StateFactory: {
    latest: typeof latest;
    latestMap: typeof latestMap;
};

// @beta @sealed
export interface StateMap<K extends string | number, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: DeepReadonly<JsonDeserialized<V>>, key: K, map: StateMap<K, V>) => void, thisArg?: unknown): void;
    get(key: K): DeepReadonly<JsonDeserialized<V>> | undefined;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value: JsonSerializable<V>): this;
    readonly size: number;
}

// @beta @sealed
export interface StatesWorkspace<TSchema extends StatesWorkspaceSchema, TManagerConstraints = unknown> {
    add<TKey extends string, TValue extends InternalTypes.ValueDirectoryOrState<any>, TManager extends TManagerConstraints>(key: TKey, manager: InternalTypes.ManagerFactory<TKey, TValue, TManager>): asserts this is StatesWorkspace<TSchema & Record<TKey, InternalTypes.ManagerFactory<TKey, TValue, TManager>>, TManagerConstraints>;
    readonly controls: BroadcastControls;
    readonly presence: Presence;
    readonly states: StatesWorkspaceEntries<TSchema>;
}

// @beta @sealed
export type StatesWorkspaceEntries<TSchema extends StatesWorkspaceSchema> = {
    /**
    * Registered State objects.
    */
    readonly [Key in keyof TSchema]: ReturnType<TSchema[Key]>["manager"] extends InternalTypes.StateValue<infer TManager> ? TManager : never;
};

// @beta
export type StatesWorkspaceEntry<TKey extends string, TValue extends InternalTypes.ValueDirectoryOrState<unknown>, TManager = unknown> = InternalTypes.ManagerFactory<TKey, TValue, TManager>;

// @beta
export interface StatesWorkspaceSchema {
    [key: string]: StatesWorkspaceEntry<typeof key, InternalTypes.ValueDirectoryOrState<any>>;
}

// @beta
export type WorkspaceAddress = `${string}:${string}`;

```
