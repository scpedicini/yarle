"use strict";
/* istanbul ignore file */
// tslint:disable:no-console
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
exports.run = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yarle = __importStar(require("./yarle"));
const loggerInfo_1 = require("./utils/loggerInfo");
const clearLogFile_1 = require("./utils/clearLogFile");
const run = async (opts) => {
    clearLogFile_1.clearLogFile();
    // tslint:disable-next-line:no-require-imports
    const argv = require('minimist')(process.argv.slice(2));
    const configFile = argv['configFile']
        ? path.isAbsolute(argv['configFile'])
            ? argv['configFile']
            : `${process.cwd()}/${argv['configFile']}`
        : `${__dirname}/../config.json`;
    console.log(`Loading config from ${configFile}`);
    const options = Object.assign(Object.assign({}, require(configFile)), opts);
    if (options.enexSources.length === 1 && options.enexSources[0].endsWith('.enex')) {
        loggerInfo_1.loggerInfo(`Converting notes in file: ${options.enexSources}`);
        await yarle.dropTheRope(options);
    }
    else {
        const enexFiles = fs
            .readdirSync(options.enexSources[0])
            .filter((file) => {
            return file.match(/.*\.enex/ig);
        });
        options.enexSources = enexFiles.map(enexFile => `${options.enexSources[0]}/${enexFile}`);
        await yarle.dropTheRope(options);
    }
};
exports.run = run;
//# sourceMappingURL=dropTheRopeRunner.js.map