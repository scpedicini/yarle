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
const fs = __importStar(require("fs"));
const url_1 = __importDefault(require("url"));
const path_1 = __importDefault(require("path"));
const electron_1 = __importDefault(require("electron"));
const yarle = __importStar(require("../yarle"));
const loggerInfo_1 = require("../utils/loggerInfo");
const store_1 = require("./store");
const settingsMapper_1 = require("./settingsMapper");
const output_format_1 = require("./../output-format");
// tslint:disable-next-line:variable-name
const Store = require('electron-store');
Store.initRenderer();
// handle setupevents as quickly as possible
// tslint:disable-next-line:no-require-imports
const setupEvents = require('./installers/setupEvents');
/*if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}*/
// Module to control application life.
const app = electron_1.default.app;
// Module to create native browser window.
const BrowserWindow = electron_1.default.BrowserWindow;
// Adds the main Menu to our app
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const defaultTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate.tmpl`, 'utf-8');
// tslint:disable-next-line:typedef
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ titleBarStyle: 'hidden',
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        backgroundColor: '#312450',
        show: false,
        icon: path_1.default.join(__dirname, 'assets/icons/png/192x192.png'),
        webPreferences: {
            nodeIntegration: true,
        },
    });
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    mainWindow.loadURL(url_1.default.format({
        pathname: path_1.default.join(__dirname, '../../src/ui/index.html'),
        protocol: 'file:',
        slashes: true,
    }));
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.once('ready-to-show', () => {
        store_1.store.set('outputFormat', output_format_1.OutputFormat.ObsidianMD);
        store_1.store.onDidChange('outputFormat', (newValue, oldValue) => {
            const logSeqConfig = fs.readFileSync(`${__dirname}/../../config.logseq.json`, 'utf-8');
            if (newValue === output_format_1.OutputFormat.LogSeqMD) {
                const logSeqTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate_logseq.tmpl`, 'utf-8');
                mainWindow.webContents.send('logSeqModeSelected', logSeqConfig, logSeqTemplate);
            }
            else {
                const defaultConfig = fs.readFileSync(`${__dirname}/../../config.json`, 'utf-8');
                mainWindow.webContents.send('logSeqModeDeselected', defaultConfig, defaultTemplate);
            }
        });
        mainWindow.show();
        const defaultConfig = fs.readFileSync(`${__dirname}/../../config.json`, 'utf-8');
        mainWindow.webContents.send('logSeqModeDeselected', defaultConfig, defaultTemplate);
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
electron_1.default.ipcMain.on('openEnexSource', () => {
    electron_1.default.dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Enex files', extensions: ['enex'] },
        ],
    }).then((result) => {
        // fileNames is an array that contains all the selected
        if (result.filePaths === undefined) {
            loggerInfo_1.loggerInfo('No file selected');
            return;
        }
        const filePath = result.filePaths;
        store_1.store.set('enexSources', result.filePaths);
        mainWindow.webContents.send('enexSources', result.filePaths.join('\n'));
    }).catch((err) => {
        loggerInfo_1.loggerInfo(err);
    });
});
electron_1.default.ipcMain.on('selectOutputFolder', () => {
    electron_1.default.dialog.showOpenDialog({
        properties: ['openDirectory'],
    }).then((result) => {
        // fileNames is an array that contains all the selected
        if (result.filePaths === undefined) {
            loggerInfo_1.loggerInfo('No file selected');
            return;
        }
        const outputPath = result.filePaths[0];
        store_1.store.set('outputDir', outputPath);
        // tslint:disable-next-line:no-console
        console.log(`outputDir: ${outputPath}`);
        mainWindow.webContents.send('outputDirectorySelected', outputPath);
    }).catch((err) => {
        loggerInfo_1.loggerInfo(err);
    });
});
electron_1.default.ipcMain.on('configurationUpdated', (event, data) => {
    store_1.store.set(data.id, data.value);
    loggerInfo_1.loggerInfo(`config: ${data.id}: ${JSON.stringify(store_1.store.get(data.id))}`);
});
electron_1.default.ipcMain.on('startConversion', async (event, data) => {
    const settings = settingsMapper_1.mapSettingsToYarleOptions();
    await yarle.dropTheRope(settings);
});
electron_1.default.ipcMain.on('saveTemplate', async (event, data) => {
    store_1.store.set(data.id, data.value);
    // tslint:disable-next-line:no-console
    console.log(`Template : ${data.value}`);
});
//# sourceMappingURL=main.js.map