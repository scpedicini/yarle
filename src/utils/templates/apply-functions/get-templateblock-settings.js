"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateBlockSettings = void 0;
const getTemplateBlockSettings = (text, check, T, value) => {
    return {
        template: text,
        check,
        startBlockPlaceholder: T.START_BLOCK,
        endBlockPlaceholder: T.END_BLOCK,
        valuePlaceholder: T.CONTENT_PLACEHOLDER,
        value,
    };
};
exports.getTemplateBlockSettings = getTemplateBlockSettings;
//# sourceMappingURL=get-templateblock-settings.js.map