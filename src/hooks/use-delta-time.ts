import { secondaryStack } from "../topo";

export function useDeltaTime(): number {
    const currentStack = secondaryStack[secondaryStack.size() - 1];
    assert(currentStack, "Attempted to useDeltaTime outside of a system.");
    return (currentStack as {deltaTime: number}).deltaTime;
}