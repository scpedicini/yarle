"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monospaceCodeBlockRule = void 0;
const filter_by_nodename_1 = require("./filter-by-nodename");
const get_attribute_proxy_1 = require("./get-attribute-proxy");
const code_block_rule_1 = require("./code-block-rule");
const markdownBlock = '\n```\n';
const codeBlockFlag = '-en-codeblock:true';
const reMonospaceFont = /\b(Courier|Mono|Consolas|Console|Inconsolata|Pitch|Monaco|monospace)\b/;
const deepestFont = node => {
    var _a, _b;
    if (node.nodeType !== 1) {
        return null;
    }
    const children = node.childNodes;
    const numChildren = children.length;
    if (numChildren > 1) {
        return 'mixed';
    }
    if (numChildren === 1) {
        const font = deepestFont(children[0]);
        if (font) {
            return font;
        }
    }
    const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
    if (node.tagName === 'FONT') {
        return (_a = nodeProxy.face) === null || _a === void 0 ? void 0 : _a.value;
    }
    const style = (_b = nodeProxy.style) === null || _b === void 0 ? void 0 : _b.value;
    if (style) {
        const match = style.match(/font-family:([^;]+)/);
        if (match) {
            return match[1];
        }
    }
    return null;
};
const isCodeBlock = node => {
    var _a;
    const nodeProxy = get_attribute_proxy_1.getAttributeProxy(node);
    const style = (_a = nodeProxy.style) === null || _a === void 0 ? void 0 : _a.value;
    if (style && style.includes(codeBlockFlag)) {
        return true;
    }
    const font = deepestFont(node);
    return font && reMonospaceFont.test(font);
};
exports.monospaceCodeBlockRule = {
    filter: filter_by_nodename_1.filterByNodeName('DIV'),
    replacement: (content, node) => {
        if (isCodeBlock(node)) {
            const previous = node.previousSibling;
            const previousIsBlock = previous && previous.tagName === node.tagName && isCodeBlock(previous);
            const next = node.nextSibling;
            const nextIsBlock = next && next.tagName === node.tagName && isCodeBlock(next);
            if (previousIsBlock || nextIsBlock) {
                content = previousIsBlock ? `\n${content}` : `${markdownBlock}${content}`;
                content = nextIsBlock ? `${content}\n` : `${content}${markdownBlock}`;
                return content;
            }
            content = code_block_rule_1.unescapeMarkdown(content);
            return content.trim() ? `${markdownBlock}${content}${markdownBlock}` : content;
        }
        if (node.parentElement && isCodeBlock(node.parentElement) && node.parentElement.firstElementChild === node) {
            return content;
        }
        if (node.parentElement && isCodeBlock(node.parentElement)) {
            return `\n${content}`;
        }
        return node.isBlock ? `\n${content}\n` : content;
    },
};
//# sourceMappingURL=monospace-code-block-rule.js.map