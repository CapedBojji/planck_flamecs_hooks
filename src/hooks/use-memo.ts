import Phantom from "@rbxts/phantom";
import { useHookState } from "../topo";
import { Modding } from "@flamework/core";

interface Storage<T> {
    value: T;
    dependencies?: Array<unknown>;
}

/**
 * 
 * @param callback - The function to memoize.
 * @param dependencies - An array of values to compare against the previous dependencies. 
 * @param discriminator - An optional value to additionally key by. 
 * @param key - An automatically generated key to store the memoized value. 
 * @returns The memoized value. 
 * @metadata macro
 */
export function useMemo<T extends unknown>(callback: () => T, dependencies?: Array<unknown>, discriminator?: unknown, key?: Modding.Caller<"uuid">): T {
    assert(key, "Attempted to use useMemo without a key.");
    const storage = useHookState<Storage<T>>(key, discriminator);
    if (!dependencies || !storage.dependencies || !Phantom.Array.equals(storage.dependencies, dependencies)) {
        storage.value = callback();
        storage.dependencies = dependencies;
    }
    return storage.value;
}