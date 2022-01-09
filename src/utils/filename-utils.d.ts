import { ResourceFileProperties } from './../models/ResourceFileProperties';
export declare const normalizeTitle: (title: string) => string;
export declare const getFileIndex: (dstPath: string, fileNamePrefix: string) => number | string;
export declare const getResourceFileProperties: (workDir: string, resource: any) => ResourceFileProperties;
export declare const getFilePrefix: (note: any) => string;
export declare const getNoteFileName: (dstPath: string, note: any) => string;
export declare const getExtensionFromResourceFileName: (resource: any) => string;
export declare const getExtensionFromMime: (resource: any) => string;
export declare const getExtension: (resource: any) => string;
export declare const getZettelKastelId: (note: any, dstPath: string) => string;
export declare const getNoteName: (dstPath: string, note: any) => string;
export declare const getNotebookName: (enexFile: string) => string;
