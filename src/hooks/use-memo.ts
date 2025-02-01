import Phantom from "@rbxts/phantom";
import { useHookState } from "../topo";
import { Modding } from "@flamework/core";

interface Storage {
    value: unknown;
    dependencies?: Array<unknown>;
}

export function useMemo(callback: Callback, dependencies: Array<unknown>, discriminator: unknown, key?: Modding.Caller<"uuid">): unknown {
    assert(key, "Attempted to use useMemo without a key.");
    const storage = useHookState<Storage>(key, discriminator);
    if (!storage.dependencies || !Phantom.Array.equals(storage.dependencies, dependencies)) {
        storage.value = callback();
        storage.dependencies = dependencies;
    }
    return storage.value;
}