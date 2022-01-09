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
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasLinkToOriginalInTemplate = exports.hasUpdateTimeInTemplate = exports.hasMetadataInTemplate = exports.hasTagsInTemplate = exports.hasSourceURLInTemplate = exports.hasOriginalLinkInTemplate = exports.hasNotebookInTemplate = exports.hasLocationInTemplate = exports.hasCreationTimeInTemplate = void 0;
const CREATIONTIME = __importStar(require("./placeholders/createdat-placeholders"));
const LOCATION = __importStar(require("./placeholders/location-placeholders"));
const NOTEBOOK = __importStar(require("./placeholders/notebook-placeholders"));
const ORIGINALLINK = __importStar(require("./placeholders/original-placeholders"));
const SOURCEURL = __importStar(require("./placeholders/sourceurl-placeholders"));
const TAGS = __importStar(require("./placeholders/tags-placeholders"));
const METADATA = __importStar(require("./placeholders/metadata-placeholders"));
const UPDATETIME = __importStar(require("./placeholders/updatedat-placeholders"));
const hasCreationTimeInTemplate = (templateContent) => {
    return hasItemInTemplate(CREATIONTIME, templateContent);
};
exports.hasCreationTimeInTemplate = hasCreationTimeInTemplate;
const hasLocationInTemplate = (templateContent) => {
    return hasItemInTemplate(LOCATION, templateContent);
};
exports.hasLocationInTemplate = hasLocationInTemplate;
const hasNotebookInTemplate = (templateContent) => {
    return hasItemInTemplate(NOTEBOOK, templateContent);
};
exports.hasNotebookInTemplate = hasNotebookInTemplate;
const hasOriginalLinkInTemplate = (templateContent) => {
    return hasItemInTemplate(ORIGINALLINK, templateContent);
};
exports.hasOriginalLinkInTemplate = hasOriginalLinkInTemplate;
const hasSourceURLInTemplate = (templateContent) => {
    return hasItemInTemplate(SOURCEURL, templateContent);
};
exports.hasSourceURLInTemplate = hasSourceURLInTemplate;
const hasTagsInTemplate = (templateContent) => {
    return hasItemInTemplate(TAGS, templateContent);
};
exports.hasTagsInTemplate = hasTagsInTemplate;
const hasMetadataInTemplate = (templateContent) => {
    return templateContent.includes(METADATA.START_BLOCK) &&
        templateContent.includes(METADATA.END_BLOCK);
};
exports.hasMetadataInTemplate = hasMetadataInTemplate;
const hasUpdateTimeInTemplate = (templateContent) => {
    return hasItemInTemplate(UPDATETIME, templateContent);
};
exports.hasUpdateTimeInTemplate = hasUpdateTimeInTemplate;
const hasLinkToOriginalInTemplate = (templateContent) => {
    return hasItemInTemplate(ORIGINALLINK, templateContent);
};
exports.hasLinkToOriginalInTemplate = hasLinkToOriginalInTemplate;
const hasItemInTemplate = (item, templateContent) => {
    return templateContent.includes(item.START_BLOCK) &&
        templateContent.includes(item.CONTENT_PLACEHOLDER) &&
        templateContent.includes(item.END_BLOCK);
};
//# sourceMappingURL=checker-functions.js.map