"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strikethroughRule = void 0;
// Note: this rule must appear *after* use(gfm) so it can override
// turndown-plugin-gfm rule for strikethrough (which always uses single '~')
exports.strikethroughRule = {
    filter: ['del', 's', 'strike'],
    replacement: (content) => {
        return `~~${content}~~`;
    },
};
//# sourceMappingURL=strikethrough-rule.js.map