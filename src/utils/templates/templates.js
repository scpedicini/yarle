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
exports.applyTemplate = void 0;
const lodash_1 = require("lodash");
const T = __importStar(require("./placeholders/metadata-placeholders"));
const apply_functions_1 = require("./apply-functions");
const remove_functions_1 = require("./remove-functions");
const applyTemplate = (noteData, yarleOptions) => {
    let result = lodash_1.cloneDeep(yarleOptions.currentTemplate);
    result = apply_functions_1.applyTitleTemplate(noteData, result, () => noteData.title);
    result = apply_functions_1.applyTagsTemplate(noteData, result, () => !yarleOptions.skipTags);
    result = apply_functions_1.applyContentTemplate(noteData, result, () => noteData.content);
    result = (yarleOptions.keepOriginalHtml && noteData.linkToOriginal)
        ? apply_functions_1.applyLinkToOriginalTemplate(noteData, result)
        : remove_functions_1.removeLinkToOriginalTemplate(result);
    result = (!yarleOptions.skipCreationTime && noteData.createdAt)
        ? apply_functions_1.applyCreatedAtTemplate(noteData, result)
        : remove_functions_1.removeCreatedAtPlaceholder(result);
    result = (!yarleOptions.skipUpdateTime && noteData.updatedAt)
        ? apply_functions_1.applyUpdatedAtTemplate(noteData, result)
        : remove_functions_1.removeUpdatedAtPlaceholder(result);
    result = (!yarleOptions.skipSourceUrl && noteData.sourceUrl)
        ? apply_functions_1.applySourceUrlTemplate(noteData, result)
        : remove_functions_1.removeSourceUrlPlaceholder(result);
    result = (!yarleOptions.skipLocation && noteData.location)
        ? apply_functions_1.applyLocationTemplate(noteData, result)
        : remove_functions_1.removeLocationPlaceholder(result);
    result = (yarleOptions.isNotebookNameNeeded && noteData.notebookName)
        ? apply_functions_1.applyNotebookTemplate(noteData, result)
        : remove_functions_1.removeNotebookPlaceholder(result);
    result = result.replace(T.START_BLOCK, '')
        .replace(T.END_BLOCK, '');
    return result;
};
exports.applyTemplate = applyTemplate;
//# sourceMappingURL=templates.js.map