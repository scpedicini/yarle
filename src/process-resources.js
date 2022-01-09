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
exports.extractDataUrlResources = exports.processResources = void 0;
const lodash_1 = require("lodash");
const fs_1 = __importDefault(require("fs"));
const md5_file_1 = __importDefault(require("md5-file"));
const path = __importStar(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils = __importStar(require("./utils"));
const yarle_1 = require("./yarle");
const output_format_1 = require("./output-format");
const getResourceWorkDirs = (note) => {
    const pathSepRegExp = new RegExp(`\\${path.sep}`, 'g');
    const relativeResourceWorkDir = utils.getRelativeResourceDir(note).replace(pathSepRegExp, yarle_1.yarleOptions.pathSeparator);
    const absoluteResourceWorkDir = utils.getAbsoluteResourceDir(note); // .replace(pathSepRegExp,yarleOptions.pathSeparator)
    return { absoluteResourceWorkDir, relativeResourceWorkDir };
};
const processResources = (note) => {
    let resourceHashes = {};
    let updatedContent = lodash_1.cloneDeep(note.content);
    const { absoluteResourceWorkDir, relativeResourceWorkDir } = getResourceWorkDirs(note);
    utils.loggerInfo(`relative resource work dir: ${relativeResourceWorkDir}`);
    utils.loggerInfo(`absolute resource work dir: ${absoluteResourceWorkDir}`);
    utils.clearResourceDir(note);
    if (Array.isArray(note.resource)) {
        for (const resource of note.resource) {
            resourceHashes = Object.assign(Object.assign({}, resourceHashes), processResource(absoluteResourceWorkDir, resource));
        }
    }
    else {
        resourceHashes = Object.assign(Object.assign({}, resourceHashes), processResource(absoluteResourceWorkDir, note.resource));
    }
    for (const hash of Object.keys(resourceHashes)) {
        updatedContent = addMediaReference(updatedContent, resourceHashes, hash, relativeResourceWorkDir);
    }
    return updatedContent;
};
exports.processResources = processResources;
const addMediaReference = (content, resourceHashes, hash, workDir) => {
    const src = `${workDir}${yarle_1.yarleOptions.pathSeparator}${resourceHashes[hash].fileName.replace(/ /g, '\ ')}`;
    utils.loggerInfo(`mediaReference src ${src} added`);
    let updatedContent = lodash_1.cloneDeep(content);
    const replace = `<en-media ([^>]*)hash="${hash}".([^>]*)>`;
    const re = new RegExp(replace, 'g');
    const matchedElements = content.match(re);
    const mediaType = matchedElements && matchedElements.length > 0 && matchedElements[0].split('type=');
    if (mediaType && mediaType.length > 1 && mediaType[1].startsWith('"image')) {
        const width = matchedElements[0].match(/width="(\w+)"/);
        const widthParam = width ? ` width="${width[1]}"` : '';
        const height = matchedElements[0].match(/height="(\w+)"/);
        const heightParam = height ? ` height="${height[1]}"` : '';
        updatedContent = content.replace(re, `<img src="${src}"${widthParam}${heightParam} alt="${resourceHashes[hash].fileName}">`);
    }
    else {
        updatedContent = content.replace(re, `<a href="${src}" type="file">${resourceHashes[hash].fileName}</a>`);
    }
    return updatedContent;
};
const processResource = (workDir, resource) => {
    const resourceHash = {};
    const data = resource.data.$text;
    const accessTime = utils.getTimeStampMoment(resource);
    const resourceFileProps = utils.getResourceFileProperties(workDir, resource);
    let fileName = resourceFileProps.fileName;
    // add time to ease the same name issue
    if (yarle_1.yarleOptions.outputFormat === output_format_1.OutputFormat.LogSeqMD) {
        fileName = `${accessTime}_${fileName}`;
    }
    const absFilePath = `${workDir}${path.sep}${fileName}`;
    fs_1.default.writeFileSync(absFilePath, data, 'base64');
    const atime = accessTime.valueOf() / 1000;
    fs_1.default.utimesSync(absFilePath, atime, atime);
    if (resource.recognition && fileName) {
        const hashIndex = resource.recognition.match(/[a-f0-9]{32}/);
        utils.loggerInfo(`resource ${fileName} addid in hash ${hashIndex}`);
        resourceHash[hashIndex] = { fileName, alreadyUsed: false };
    }
    else {
        const md5Hash = md5_file_1.default.sync(absFilePath);
        resourceHash[md5Hash] = { fileName, alreadyUsed: false };
    }
    return resourceHash;
};
const extractDataUrlResources = (note, content) => {
    if (content.indexOf('src="data:') < 0) {
        return content; // no data urls
    }
    const { absoluteResourceWorkDir, relativeResourceWorkDir } = getResourceWorkDirs(note);
    fs_extra_1.default.mkdirsSync(absoluteResourceWorkDir);
    // src="data:image/svg+xml;base64,..." --> src="resourceDir/fileName"
    return content.replace(/src="data:([^;,]*)(;base64)?,([^"]*)"/g, (match, mediatype, encoding, data) => {
        const fileName = createResourceFromData(mediatype, encoding === ';base64', data, absoluteResourceWorkDir, note);
        const src = `${relativeResourceWorkDir}${yarle_1.yarleOptions.pathSeparator}${fileName}`;
        return `src="${src}"`;
    });
};
exports.extractDataUrlResources = extractDataUrlResources;
// returns filename of new resource
const createResourceFromData = (mediatype, base64, data, absoluteResourceWorkDir, note) => {
    const baseName = 'embedded'; // data doesn't seem to include useful base filename
    const extension = extensionForMimeType(mediatype) || '.dat';
    const index = utils.getFileIndex(absoluteResourceWorkDir, baseName);
    const fileName = index < 1 ? `${baseName}.${extension}` : `${baseName}.${index}.${extension}`;
    const absFilePath = `${absoluteResourceWorkDir}${path.sep}${fileName}`;
    if (!base64) {
        data = decodeURIComponent(data);
    }
    fs_1.default.writeFileSync(absFilePath, data, base64 ? 'base64' : undefined);
    utils.setFileDates(absFilePath, note);
    utils.loggerInfo(`data url resource ${fileName} added`);
    return fileName;
};
const extensionForMimeType = (mediatype) => {
    // image/jpeg or image/svg+xml or audio/wav or ...
    const subtype = mediatype.split('/').pop(); // jpeg or svg+xml or wav
    return subtype.split('+')[0]; // jpeg or svg or wav
};
//# sourceMappingURL=process-resources.js.map