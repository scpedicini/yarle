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
exports.loggerInfo = exports.LOGFILE = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// tslint:disable-next-line:no-require-imports
const { EOL } = require('os');
const getAppDataPath = () => {
    switch (process.platform) {
        case 'darwin': {
            return path.join(process.env.HOME, 'Library', 'Application Support', 'yarle-evernote-to-md');
        }
        case 'win32': {
            return path.join(process.env.APPDATA, 'yarle-evernote-to-md');
        }
        case 'linux': {
            return path.join(process.env.HOME, '.yarle-evernote-to-md');
        }
        default: {
            // tslint:disable-next-line:no-console
            console.log('Unsupported platform!');
            process.exit(1);
        }
    }
};
exports.LOGFILE = path.join(getAppDataPath(), 'conversion.log');
// tslint:disable-next-line:no-console
console.log(`logfilepath: ${exports.LOGFILE}`);
const loggerInfo = (message) => {
    if (!fs.existsSync(exports.LOGFILE)) {
        fs.mkdirSync(getAppDataPath(), { recursive: true });
        fs.writeFileSync(exports.LOGFILE, '');
    }
    fs.appendFileSync(exports.LOGFILE, `${message}${EOL}`);
};
exports.loggerInfo = loggerInfo;
//# sourceMappingURL=loggerInfo.js.map