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
exports.applyContentTemplate = void 0;
const lodash_1 = require("lodash");
const P = __importStar(require("../placeholders/content-placeholders"));
const apply_template_on_block_1 = require("./apply-template-on-block");
const get_templateblock_settings_1 = require("./get-templateblock-settings");
const applyContentTemplate = (noteData, inputText, check) => {
    const result = lodash_1.cloneDeep(inputText);
    const contentTemplateSettings = get_templateblock_settings_1.getTemplateBlockSettings(result, check, P, noteData.content);
    return apply_template_on_block_1.applyTemplateOnBlock(contentTemplateSettings);
};
exports.applyContentTemplate = applyContentTemplate;
//# sourceMappingURL=apply-content-template.js.map