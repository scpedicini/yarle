"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
exports.logger = winston_1.createLogger({
    level: 'info',
    format: winston_1.format.simple(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        new winston_1.transports.File({ filename: path_1.default.join(__dirname, 'error.log'), level: 'error' }),
        new winston_1.transports.File({ filename: path_1.default.join(__dirname, 'conversion.log'), options: { flags: 'w' } }),
    ],
});
//# sourceMappingURL=logger.js.map