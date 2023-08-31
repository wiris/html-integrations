/* tslint:disable */
/* eslint-disable */
/**
*/
export function main_js(): void;
/**
*/
export enum Level {
  Error = 0,
  Warn = 1,
  Info = 2,
  Debug = 3,
}
/**
*/
export class Telemeter {
  free(): void;
/**
* @param {any} solution
* @param {any} hosts
* @param {any} config
*/
  constructor(solution: any, hosts: any, config: any);
/**
* @param {string} sender_id
* @returns {Promise<any>}
*/
  identify(sender_id: string): Promise<any>;
/**
* @param {string} event_type
* @param {any} event_payload
* @returns {Promise<any>}
*/
  track(event_type: string, event_payload: any): Promise<any>;
/**
* @param {any} level
* @param {string} message
* @param {any} payload
* @returns {Promise<any>}
*/
  log(level: any, message: string, payload: any): Promise<any>;
/**
* @returns {Promise<any>}
*/
  finish(): Promise<any>;
/**
* @param {boolean | undefined} new_debug_status
*/
  debug(new_debug_status?: boolean): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly fuzzyhash: (a: number, b: number) => number;
  readonly fuzzyhash_compare: (a: number, b: number) => number;
  readonly __wbg_telemeter_free: (a: number) => void;
  readonly telemeter_new: (a: number, b: number, c: number, d: number) => void;
  readonly telemeter_identify: (a: number, b: number, c: number) => number;
  readonly telemeter_track: (a: number, b: number, c: number, d: number) => number;
  readonly telemeter_log: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly telemeter_finish: (a: number) => number;
  readonly telemeter_debug: (a: number, b: number) => void;
  readonly main_js: () => void;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_export_3: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_4: (a: number, b: number) => void;
  readonly __wbindgen_export_5: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: (a: number) => void;
  readonly __wbindgen_export_7: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
