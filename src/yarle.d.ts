import { YarleOptions } from './YarleOptions';
export declare const defaultYarleOptions: YarleOptions;
export declare let yarleOptions: YarleOptions;
export declare const parseStream: (options: YarleOptions, enexSource: string) => Promise<void>;
export declare const dropTheRope: (options: YarleOptions) => Promise<void>;
