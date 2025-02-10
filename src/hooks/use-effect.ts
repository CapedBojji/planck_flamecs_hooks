import { Modding } from "@flamework/core";
import { useHookState } from "../topo";
import Phantom from "@rbxts/phantom";

interface Storage {
    cleanup?: () => void;
    dependencies?: Array<unknown>; 
}

/**
 * 
 * @param callback - The function to memoize.
 * @param dependencies - An array of values to compare against the previous dependencies. 
 * @param discriminator - An optional value to additionally key by. 
 * @param key - An automatically generated key to store the memoized value.
 * @metadata macro 
 */
export function useEffect(callback: Callback, dependencies?: Array<unknown>, discriminator?: unknown, key?: Modding.Caller<"uuid">): void {
    assert(key, "Attempted to use useEffect without a key.");
    const storage = useHookState<Storage>(key, discriminator);
    if (!dependencies || !storage.dependencies || !Phantom.Array.equals(storage.dependencies, dependencies)) {
        if (storage.cleanup) {
            storage.cleanup();
        }
        storage.cleanup = callback();
        storage.dependencies = dependencies;
    }
}