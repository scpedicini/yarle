"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyConditionalTemplate = void 0;
const applyConditionalTemplate = (text, P, newValue) => {
    return text
        .replace(new RegExp(`${P.CONTENT_PLACEHOLDER}`, 'g'), newValue)
        .replace(new RegExp(`${P.START_BLOCK}`, 'g'), '')
        .replace(new RegExp(`${P.END_BLOCK}`, 'g'), '');
};
exports.applyConditionalTemplate = applyConditionalTemplate;
//# sourceMappingURL=apply-conditional-template.js.map