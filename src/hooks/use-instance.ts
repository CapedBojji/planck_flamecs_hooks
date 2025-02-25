import Phantom from "@rbxts/phantom";
import { useHookState } from "../topo";
import { Modding } from "@flamework/core";


interface Storage<T extends Instance> {
    instance?: T;
    dependencies?: Array<unknown>;
}


export function useInstance<T extends Instance>(
    creator: () => T,
    dependencies?: Array<unknown>,
    discriminator?: unknown,
    key?: Modding.Caller<"uuid">,
): T {
    assert(key, "Attempted to use useInstance without a key.");
    const storage = useHookState<Storage<T>>(key, discriminator, (storage) => {
        if (storage.instance) {
            storage.instance.Destroy();
        }
        return true
    }
    );
    if (!storage.instance || !dependencies || !storage.dependencies || !Phantom.Array.equals(storage.dependencies, dependencies)) {
        storage.instance = creator();
        storage.dependencies = dependencies;
    }
    return storage.instance as T;
}
