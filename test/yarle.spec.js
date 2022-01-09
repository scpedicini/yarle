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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const timezone_mock_1 = __importDefault(require("timezone-mock"));
const eol_1 = __importDefault(require("eol"));
const path = __importStar(require("path"));
const utils = __importStar(require("./../src/utils"));
const yarle = __importStar(require("./../src/yarle"));
const utils_1 = require("./../src/utils");
const yarle_tests_1 = require("./yarle-tests");
const yarle_test_modifier_options_1 = require("./yarle-test-modifier-options");
describe('Yarle simple cases', async () => {
    before(() => {
        timezone_mock_1.default.register('Europe/London');
    });
    after(() => {
        timezone_mock_1.default.unregister();
    });
    afterEach(async () => {
        utils.clearMdNotesDistDir();
    });
    const tests = yarle_tests_1.yarleTests;
    for (const yarleTest of tests) {
        const conditionalTest = (yarleTest.testModifier === yarle_test_modifier_options_1.YarleTestModifierOptions.skip)
            ? it.skip
            : (yarleTest.testModifier === yarle_test_modifier_options_1.YarleTestModifierOptions.only)
                ? it.only
                : it;
        conditionalTest(yarleTest.name, async () => {
            await yarle.dropTheRope(yarleTest.options);
            console.log(`conversion log: ${fs_1.default.readFileSync(utils_1.LOGFILE)}`);
            const output = `${__dirname}${path.sep}..${path.sep}${yarleTest.options.outputDir}${path.sep}${yarleTest.testOutputPath}`;
            const expectedOutput = yarleTest.expectedOutputPath ? `${__dirname}${path.sep}${yarleTest.expectedOutputPath}` : undefined;
            assert_1.default.ok(fs_1.default.existsSync(output));
            if (expectedOutput)
                assert_1.default.equal(eol_1.default.auto(fs_1.default.readFileSync(output, 'utf8')), fs_1.default.readFileSync(expectedOutput, 'utf8'));
        });
    }
});
//# sourceMappingURL=yarle.spec.js.map