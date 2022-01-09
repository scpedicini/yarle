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
exports.writeFile = void 0;
const fs = __importStar(require("fs"));
const content_utils_1 = require("./content-utils");
const logger_1 = require("./../utils/logger");
const writeFile = (absFilePath, data, note) => {
    try {
        fs.writeFileSync(absFilePath, data);
        content_utils_1.setFileDates(absFilePath, note);
    }
    catch (e) {
        // tslint:disable-next-line: no-console
        logger_1.logger.error('Cannot write file ', e);
        throw e;
    }
};
exports.writeFile = writeFile;
//# sourceMappingURL=file-utils.js.map