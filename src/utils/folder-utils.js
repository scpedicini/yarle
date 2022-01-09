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
exports.setPaths = exports.clearMdNotesDistDir = exports.clearResourceDistDir = exports.clearResourceDir = exports.getAbsoluteResourceDir = exports.getRelativeResourceDir = exports.getHtmlFileLink = exports.getHtmlFilePath = exports.getMdFilePath = exports.getResourceDir = exports.paths = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const yarle_1 = require("../yarle");
const filename_utils_1 = require("./filename-utils");
const loggerInfo_1 = require("./loggerInfo");
const output_format_1 = require("./../output-format");
exports.paths = {};
const getResourceDir = (dstPath, note) => {
    return filename_utils_1.getNoteName(dstPath, note).replace(/\s/g, '_');
};
exports.getResourceDir = getResourceDir;
const getFilePath = (dstPath, note) => {
    return `${dstPath}${path.sep}${filename_utils_1.getNoteFileName(dstPath, note)}`;
};
const getMdFilePath = (note) => {
    return getFilePath(exports.paths.mdPath, note);
};
exports.getMdFilePath = getMdFilePath;
const getHtmlFilePath = (note) => {
    return getFilePath(exports.paths.resourcePath, note).replace(/\.md$/, '.html');
};
exports.getHtmlFilePath = getHtmlFilePath;
const getHtmlFileLink = (note) => {
    const filePath = exports.getHtmlFilePath(note);
    return `.${filePath.slice(exports.paths.resourcePath.lastIndexOf(path.sep))}`;
};
exports.getHtmlFileLink = getHtmlFileLink;
const clearDistDir = (dstPath) => {
    if (fs_1.default.existsSync(dstPath)) {
        fs_extra_1.default.removeSync(dstPath);
    }
    fs_1.default.mkdirSync(dstPath);
};
const getRelativeResourceDir = (note) => {
    return yarle_1.yarleOptions.haveEnexLevelResources ? `.${path.sep}${yarle_1.yarleOptions.resourcesDir}` : `.${path.sep}${yarle_1.yarleOptions.resourcesDir}${path.sep}${exports.getResourceDir(exports.paths.mdPath, note)}.resources`;
};
exports.getRelativeResourceDir = getRelativeResourceDir;
const getAbsoluteResourceDir = (note) => {
    return yarle_1.yarleOptions.haveEnexLevelResources ? exports.paths.resourcePath : `${exports.paths.resourcePath}${path.sep}${exports.getResourceDir(exports.paths.mdPath, note)}.resources`;
};
exports.getAbsoluteResourceDir = getAbsoluteResourceDir;
const resourceDirClears = new Map();
const clearResourceDir = (note) => {
    const absResourcePath = exports.getAbsoluteResourceDir(note);
    if (!resourceDirClears.has(absResourcePath)) {
        resourceDirClears.set(absResourcePath, 0);
    }
    const clears = resourceDirClears.get(absResourcePath);
    // we're sharing a resource dir, so we can can't clean it more than once
    if (yarle_1.yarleOptions.haveEnexLevelResources && clears >= 1) {
        return;
    }
    clearDistDir(absResourcePath);
    resourceDirClears.set(absResourcePath, clears + 1);
};
exports.clearResourceDir = clearResourceDir;
const clearResourceDistDir = () => {
    clearDistDir(exports.paths.resourcePath);
};
exports.clearResourceDistDir = clearResourceDistDir;
const clearMdNotesDistDir = () => {
    clearDistDir(exports.paths.mdPath);
};
exports.clearMdNotesDistDir = clearMdNotesDistDir;
const setPaths = (enexSource) => {
    // loggerInfo('setting paths');
    const enexFolder = enexSource.split(path.sep);
    // loggerInfo(`enex folder split: ${JSON.stringify(enexFolder)}`);
    const enexFile = (enexFolder.length >= 1 ? enexFolder[enexFolder.length - 1] : enexFolder[0]).split('.')[0];
    // loggerInfo(`enex file: ${enexFile}`);
    const outputDir = path.isAbsolute(yarle_1.yarleOptions.outputDir)
        ? yarle_1.yarleOptions.outputDir
        : `${process.cwd()}${path.sep}${yarle_1.yarleOptions.outputDir}`;
    exports.paths.mdPath = `${outputDir}${path.sep}notes${path.sep}`;
    exports.paths.resourcePath = `${outputDir}${path.sep}notes${path.sep}${yarle_1.yarleOptions.resourcesDir}`;
    // loggerInfo(`Skip enex filename from output? ${yarleOptions.skipEnexFileNameFromOutputPath}`);
    if (!yarle_1.yarleOptions.skipEnexFileNameFromOutputPath) {
        exports.paths.mdPath = `${exports.paths.mdPath}${enexFile}`;
        // loggerInfo(`mdPath: ${paths.mdPath}`);
        exports.paths.resourcePath = `${outputDir}${path.sep}notes${path.sep}${enexFile}${path.sep}${yarle_1.yarleOptions.resourcesDir}`;
    }
    if (yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD) {
        const folderName = yarle_1.yarleOptions.logseqSettings.journalNotes ? 'journal' : 'pages';
        exports.paths.mdPath = `${outputDir}${path.sep}${folderName}${path.sep}`;
        exports.paths.resourcePath = `${outputDir}${path.sep}${yarle_1.yarleOptions.resourcesDir}`;
    }
    fs_extra_1.default.mkdirsSync(exports.paths.mdPath);
    fs_extra_1.default.mkdirsSync(exports.paths.resourcePath);
    loggerInfo_1.loggerInfo(`path ${exports.paths.mdPath} created`);
    // clearDistDir(paths.simpleMdPath);
    // clearDistDir(paths.complexMdPath);
};
exports.setPaths = setPaths;
//# sourceMappingURL=folder-utils.js.map