"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTemplateOnBlock = void 0;
const applyTemplateOnBlock = ({ template, check, startBlockPlaceholder, endBlockPlaceholder, valuePlaceholder, value, }) => {
    if (value && check()) {
        return template
            .replace(new RegExp(`${startBlockPlaceholder}`, 'g'), '')
            .replace(new RegExp(`${endBlockPlaceholder}`, 'g'), '')
            .replace(new RegExp(`${valuePlaceholder}`, 'g'), value);
    }
    const reg = `${startBlockPlaceholder}([\\d\\D])(?:.|(\r\n|\r|\n))*?(?=${endBlockPlaceholder})${endBlockPlaceholder}`;
    return template.replace(new RegExp(reg, 'g'), '');
};
exports.applyTemplateOnBlock = applyTemplateOnBlock;
//# sourceMappingURL=apply-template-on-block.js.map