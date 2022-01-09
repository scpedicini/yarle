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
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const moment_1 = __importDefault(require("moment"));
const utils = __importStar(require("./../src/utils"));
const options = __importStar(require("./../src/xml-parser.options"));
describe('SetFileDates', () => {
    let content;
    let notebook;
    let notes;
    before(() => {
        content = fs_1.default.readFileSync('./test/data/test-justText.enex', 'utf8');
        notebook = fast_xml_parser_1.default.parse(content, options.xmlParserOptions);
        notes = notebook['en-export'];
    });
    it('happy path =» file exists and modified successfully', () => {
        utils.setFileDates('./test/data/test-justText.enex', notes['note']);
        const fStat = fs_1.default.statSync('./test/data/test-justText.enex');
        const atime = moment_1.default(fStat.atime).format();
        const mtime = moment_1.default(fStat.mtime).format();
        const referTime = moment_1.default('20181006T084411Z');
        assert_1.default.equal(atime, referTime.format());
        assert_1.default.equal(mtime, referTime.format());
    });
    it('throws an error in case of a missing file', () => {
        let errorHappened = false;
        try {
            utils.setFileDates('./test/data/do_not_exists.enex', notes['note']);
        }
        catch (e) {
            errorHappened = true;
        }
        assert_1.default.ok(errorHappened);
    });
    it('set to now if no updated field in note', () => {
        notes['note']['updated'] = undefined;
        utils.setFileDates('./test/data/test-justText.enex', notes['note']);
        const fStat = fs_1.default.statSync('./test/data/test-justText.enex');
        const atime = moment_1.default(fStat.atime);
        const mtime = moment_1.default(fStat.mtime);
        const referTimeLo = moment_1.default().subtract(3, 's');
        const referTimeHi = moment_1.default().add(3, 's');
        assert_1.default.ok(atime.isBetween(referTimeLo, referTimeHi));
        assert_1.default.ok(mtime.isBetween(referTimeLo, referTimeHi));
    });
});
describe('extensions', () => {
    it('no resource-attributes', () => {
        const resource = {};
        const extension = utils.getExtension(resource);
        assert_1.default.equal(extension, 'dat');
    });
    it('no mime, no filename', () => {
        const resource = {
            'resource-attributes': {},
        };
        const extension = utils.getExtension(resource);
        assert_1.default.equal(extension, 'dat');
    });
    it('no mime, no filename extension - DAT', () => {
        const resource = {
            'resource-attributes': {
                'file-name': 'fileName',
            },
        };
        const extension = utils.getExtension(resource);
        assert_1.default.equal(extension, 'dat');
    });
    it('no mime, filename has extension - JPG', () => {
        const resource = {
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const extension = utils.getExtension(resource);
        assert_1.default.equal(extension, 'jpg');
    });
    it('Mime, filename has no extension - PNG', () => {
        const resource = {
            mime: 'image/png',
            'resource-attributes': {
                'file-name': 'fileName',
            },
        };
        const extension = utils.getExtension(resource);
        assert_1.default.equal(extension, 'png');
    });
    it('Mime, filename has extension, extension has greater precendence - JPG', () => {
        const resource = {
            mime: 'image/png',
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const extension = utils.getExtension(resource);
        assert_1.default.equal(extension, 'jpg');
    });
    it('Mime, filename has extension, mime cannot be parsed - PNG', () => {
        const resource = {
            mime: 'image-png',
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const extension = utils.getExtension(resource);
        assert_1.default.equal(extension, 'jpg');
    });
});
describe('timestamps', () => {
    it('timestamp returned', () => {
        const timestamp = '19700101T000000Z';
        const resource = {
            'resource-attributes': {
                timestamp,
            },
        };
        const accessMoment = utils.getTimeStampMoment(resource);
        assert_1.default.ok(accessMoment.isSame(moment_1.default(timestamp)));
    });
    it('no stored timstamp, return now', () => {
        const resource = {
            'resource-attributes': {},
        };
        const accessMoment = utils.getTimeStampMoment(resource);
        const referTimeLo = moment_1.default().subtract(3, 's');
        const referTimeHi = moment_1.default().add(3, 's');
        assert_1.default.ok(accessMoment.isBetween(referTimeLo, referTimeHi));
    });
});
describe('filename', () => {
    it('filename returned', () => {
        const resource = {
            mime: 'image/png',
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const fileProps = utils.getResourceFileProperties('./test/data', resource);
        assert_1.default.equal(fileProps.fileName, 'fileName.jpg');
    });
    it('filename returned, file already exists, no extension', () => {
        const resource = {
            'resource-attributes': {
                'file-name': 'simpleFile',
            },
        };
        const fileProps = utils.getResourceFileProperties('./test/data', resource);
        assert_1.default.equal(fileProps.fileName, 'simpleFile.1.dat');
    });
});
//# sourceMappingURL=utils.spec.js.map