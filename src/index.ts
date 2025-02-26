import { Plugin, SystemFn } from "@rbxts/planck/out/types";
import { secondaryStack, start } from "./topo";
import Scheduler from "@rbxts/planck/out/Scheduler";
import Phase from "@rbxts/planck/out/Phase";
export * from "./hooks"
export * from "./topo"

interface ModuleInfo {
	nameToSystem: Map<string, SystemFn<unknown[]>>;
	systemToName: Map<SystemFn<unknown[]>, string>;
}
type Cleanup<T> = (state: T) => boolean;
interface HookStorage<T> {
    cleanup?: Cleanup<T>;
    states: Map<string, T>;
}
export class PlanckFlamecsHooksPlugin implements Plugin {
	private readonly systemData: Map<SystemFn<unknown[]>, {
		system: SystemFn<unknown[]>;
		data: Record<string, HookStorage<unknown>>;
	}> = new Map();




	build(schedular: Scheduler<unknown[]>): void {
		schedular._addHook(schedular.Hooks.SystemAdd, (info) => {
			const SystemInfo = info.system;
			const system = SystemInfo.system;
			this.systemData.set(system, { system, data: {} });
		})
		schedular._addHook(schedular.Hooks.SystemRemove, (info) => {
			const SystemInfo = info.system;
			const system = SystemInfo.system;
			this.systemData.delete(system);
		})
		schedular._addHook(schedular.Hooks.SystemReplace, (info) => {
			const oldSystemInfo = info.old;
			const newSystemInfo = info.new;
			const oldSystem = oldSystemInfo.system;
			const newSystem = newSystemInfo.system;
			const data = this.systemData.get(oldSystem);
			assert(data !== undefined, "System data not found");
			this.systemData.delete(oldSystem);
			this.systemData.set(newSystem, data);
		})
		schedular._addHook(schedular.Hooks.OuterSystemCall, (info) => {
			const system = info.system.system;
			const phase = info.system.phase;
			const nextFn = info.nextFn;
			const data = this.systemData.get(system);
			assert(data !== undefined, "System data not found"); // Should never happen
			return () => {
				secondaryStack.push(data)
				start(data.data, () => {
					nextFn();
				})
				secondaryStack.pop()
			}
		})
	}
}
