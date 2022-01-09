"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeStampMoment = exports.setFileDates = exports.logTags = exports.getTags = exports.getLatLong = exports.getLinkToOriginal = exports.getSourceUrl = exports.getUpdateTime = exports.getCreationTime = exports.getTitle = exports.getMetadata = void 0;
const moment_1 = __importDefault(require("moment"));
const fs_1 = require("fs");
const utimes_1 = require("utimes");
const yarle_1 = require("./../yarle");
const folder_utils_1 = require("./folder-utils");
const getMetadata = (note, notebookName) => {
    return {
        createdAt: exports.getCreationTime(note),
        updatedAt: exports.getUpdateTime(note),
        sourceUrl: exports.getSourceUrl(note),
        location: exports.getLatLong(note),
        linkToOriginal: exports.getLinkToOriginal(note),
        notebookName,
    };
};
exports.getMetadata = getMetadata;
const getTitle = (note) => {
    return note.title ? `# ${note.title}` : '';
};
exports.getTitle = getTitle;
const getCreationTime = (note) => {
    return !yarle_1.yarleOptions.skipCreationTime && note.created
        ? moment_1.default(note.created).format(yarle_1.yarleOptions.dateFormat)
        : undefined;
};
exports.getCreationTime = getCreationTime;
const getUpdateTime = (note) => {
    return !yarle_1.yarleOptions.skipUpdateTime && note.updated
        ? moment_1.default(note.updated).format(yarle_1.yarleOptions.dateFormat)
        : undefined;
};
exports.getUpdateTime = getUpdateTime;
const getSourceUrl = (note) => {
    return !yarle_1.yarleOptions.skipSourceUrl &&
        note['note-attributes']
        ? note['note-attributes']['source-url']
        : undefined;
};
exports.getSourceUrl = getSourceUrl;
const getLinkToOriginal = (note) => {
    return yarle_1.yarleOptions.keepOriginalHtml ?
        folder_utils_1.getHtmlFileLink(note) : undefined;
};
exports.getLinkToOriginal = getLinkToOriginal;
const getLatLong = (note) => {
    return !yarle_1.yarleOptions.skipLocation &&
        note['note-attributes'] &&
        note['note-attributes'].longitude
        ? `${note['note-attributes'].latitude},${note['note-attributes'].longitude}`
        : undefined;
};
exports.getLatLong = getLatLong;
const getTags = (note) => {
    return { tags: exports.logTags(note) };
};
exports.getTags = getTags;
const logTags = (note) => {
    if (!yarle_1.yarleOptions.skipTags && note.tag) {
        const tagArray = Array.isArray(note.tag) ? note.tag : [note.tag];
        const tagOptions = yarle_1.yarleOptions.nestedTags;
        const tags = tagArray.map((tag) => {
            let cleanTag = tag
                .toString()
                .replace(/^#/, '');
            if (tagOptions) {
                cleanTag = cleanTag.replace(new RegExp(tagOptions.separatorInEN, 'g'), tagOptions.replaceSeparatorWith);
            }
            const replaceSpaceWith = (tagOptions && tagOptions.replaceSpaceWith) || '-';
            cleanTag = cleanTag.replace(/ /g, replaceSpaceWith);
            return `${yarle_1.yarleOptions.useHashTags ? '#' : ''}${cleanTag}`;
        });
        return tags.join(' ');
    }
    return undefined;
};
exports.logTags = logTags;
const setFileDates = (path, note) => {
    const updated = moment_1.default(note.updated).valueOf();
    const mtime = updated / 1000;
    fs_1.utimesSync(path, mtime, mtime);
    // also set creation time where supported
    const created = moment_1.default(note.created).valueOf();
    if (created) {
        utimes_1.utimes(path, { btime: created });
    }
};
exports.setFileDates = setFileDates;
const getTimeStampMoment = (resource) => {
    return resource['resource-attributes'] &&
        resource['resource-attributes']['timestamp']
        ? moment_1.default(resource['resource-attributes']['timestamp'])
        : moment_1.default();
};
exports.getTimeStampMoment = getTimeStampMoment;
//# sourceMappingURL=content-utils.js.map