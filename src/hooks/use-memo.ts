import Phantom from "@rbxts/phantom";
import { useHookState } from "../topo";
import { Modding } from "@flamework/core";

interface Storage<T> {
    value: T;
    dependencies?: Array<unknown>;
}

export function useMemo<T extends unknown>(callback: Callback, dependencies?: Array<unknown>, discriminator?: unknown, key?: Modding.Caller<"uuid">): T {
    assert(key, "Attempted to use useMemo without a key.");
    const storage = useHookState<Storage<T>>(key, discriminator);
    if (!dependencies || !storage.dependencies || !Phantom.Array.equals(storage.dependencies, dependencies)) {
        storage.value = callback();
        storage.dependencies = dependencies;
    }
    return storage.value;
}