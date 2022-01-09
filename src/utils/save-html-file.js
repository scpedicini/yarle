"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveHtmlFile = void 0;
const _1 = require(".");
const file_utils_1 = require("./file-utils");
const saveHtmlFile = (noteData, note) => {
    if (noteData.htmlContent) {
        const absHtmlFilePath = _1.getHtmlFilePath(note);
        file_utils_1.writeFile(absHtmlFilePath, noteData.htmlContent, note);
    }
};
exports.saveHtmlFile = saveHtmlFile;
//# sourceMappingURL=save-html-file.js.map