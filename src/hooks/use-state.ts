import { Modding } from "@flamework/core";
import { useHookState } from "../topo";

interface Storage<T> {
    data : {
        value: T;
    }
}

/**
 * 
 * @param initialValue - The initial value of the state.
 * @param discriminator - An optional value to additionally key by.
 * @param key - An automatically generated key to store the state.
 * @returns A tuple containing the current state value and a function to update it.
 * @metadata macro
 */
export function useState<T>(initialValue: T, discriminator?: unknown, key?: Modding.Caller<"uuid">): LuaTuple<[T, (newValue: T) => void]> {
    assert(key, "Attempted to use useState without a key.");
    const storage = useHookState<Storage<T>>(key, discriminator);
    if (!storage.data) {
        storage.data = { value: initialValue };
    }
    return $tuple(storage.data.value, (newValue: T) => {
        storage.data.value = newValue;
    });
}