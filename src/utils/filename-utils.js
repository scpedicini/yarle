"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotebookName = exports.getNoteName = exports.getZettelKastelId = exports.getExtension = exports.getExtensionFromMime = exports.getExtensionFromResourceFileName = exports.getNoteFileName = exports.getFilePrefix = exports.getResourceFileProperties = exports.getFileIndex = exports.normalizeTitle = void 0;
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const fs = __importStar(require("fs"));
const moment_1 = __importDefault(require("moment"));
const path = __importStar(require("path"));
const mime = __importStar(require("mime-types"));
const yarle_1 = require("../yarle");
const output_format_1 = require("./../output-format");
const content_utils_1 = require("./content-utils");
const FILENAME_DELIMITER = '_';
const normalizeTitle = (title) => {
    return sanitize_filename_1.default(title, { replacement: FILENAME_DELIMITER });
};
exports.normalizeTitle = normalizeTitle;
const getFileIndex = (dstPath, fileNamePrefix) => {
    const index = fs
        .readdirSync(dstPath)
        .filter(file => file.indexOf(fileNamePrefix) > -1)
        .length;
    return index;
};
exports.getFileIndex = getFileIndex;
const getResourceFileProperties = (workDir, resource) => {
    const UNKNOWNFILENAME = 'unknown_filename';
    const extension = exports.getExtension(resource);
    let fileName = UNKNOWNFILENAME;
    if (resource['resource-attributes'] && resource['resource-attributes']['file-name']) {
        const fileNamePrefix = resource['resource-attributes']['file-name'].substr(0, 50);
        fileName = fileNamePrefix.split('.')[0];
    }
    fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
    const index = exports.getFileIndex(workDir, fileName);
    const fileNameWithIndex = index > 0 ? `${fileName}.${index}` : fileName;
    return {
        fileName: `${fileNameWithIndex}.${extension}`,
        extension,
        index,
    };
};
exports.getResourceFileProperties = getResourceFileProperties;
const getFilePrefix = (note) => {
    return exports.normalizeTitle(note['title'] ? `${note['title'].toString()}` : 'Untitled');
};
exports.getFilePrefix = getFilePrefix;
const getNoteFileName = (dstPath, note) => {
    return `${exports.getNoteName(dstPath, note)}.md`;
};
exports.getNoteFileName = getNoteFileName;
const getExtensionFromResourceFileName = (resource) => {
    if (!(resource['resource-attributes'] &&
        resource['resource-attributes']['file-name'])) {
        return undefined;
    }
    const splitFileName = resource['resource-attributes']['file-name'].split('.');
    return splitFileName.length > 1 ? splitFileName[splitFileName.length - 1] : undefined;
};
exports.getExtensionFromResourceFileName = getExtensionFromResourceFileName;
const getExtensionFromMime = (resource) => {
    const mimeType = resource.mime;
    if (!mimeType) {
        return undefined;
    }
    return mime.extension(mimeType);
};
exports.getExtensionFromMime = getExtensionFromMime;
const getExtension = (resource) => {
    const UNKNOWNEXTENSION = 'dat';
    return exports.getExtensionFromResourceFileName(resource) || exports.getExtensionFromMime(resource) || UNKNOWNEXTENSION;
};
exports.getExtension = getExtension;
const getZettelKastelId = (note, dstPath) => {
    return moment_1.default(note['created']).format('YYYYMMDDHHmm');
};
exports.getZettelKastelId = getZettelKastelId;
const getNoteName = (dstPath, note) => {
    let noteName;
    if (yarle_1.yarleOptions.isZettelkastenNeeded) {
        const zettelPrefix = exports.getZettelKastelId(note, dstPath);
        const nextIndex = exports.getFileIndex(dstPath, zettelPrefix);
        const separator = ' ';
        noteName = (nextIndex !== 0) ?
            `${zettelPrefix}.${nextIndex}` :
            zettelPrefix;
        noteName += exports.getFilePrefix(note) !== 'Untitled' ? `${separator}${exports.getFilePrefix(note)}` : '';
    }
    else {
        const fileNamePrefix = exports.getFilePrefix(note);
        const nextIndex = exports.getFileIndex(dstPath, fileNamePrefix);
        noteName = (nextIndex === 0) ? fileNamePrefix : `${fileNamePrefix}.${nextIndex}`;
    }
    if (yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD && yarle_1.yarleOptions.logseqSettings.journalNotes) {
        return content_utils_1.getCreationTime(note);
    }
    return noteName;
};
exports.getNoteName = getNoteName;
const getNotebookName = (enexFile) => {
    const notebookName = path.basename(enexFile, '.enex');
    return notebookName;
};
exports.getNotebookName = getNotebookName;
//# sourceMappingURL=filename-utils.js.map