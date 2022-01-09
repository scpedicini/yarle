"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMdFile = void 0;
const file_utils_1 = require("./file-utils");
const folder_utils_1 = require("./folder-utils");
const loggerInfo_1 = require("./loggerInfo");
const saveMdFile = (data, note) => {
    const absMdFilePath = folder_utils_1.getMdFilePath(note);
    file_utils_1.writeFile(absMdFilePath, data, note);
    loggerInfo_1.loggerInfo(`Note saved to ${absMdFilePath}`);
};
exports.saveMdFile = saveMdFile;
//# sourceMappingURL=save-md-file.js.map