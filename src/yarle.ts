// tslint:disable:no-console
import fs from 'fs';
import { merge } from 'lodash';
import * as path from 'path';
import flow from 'xml-flow';
import axios from 'axios';
import * as stream from 'stream';


import * as utils from './utils';
import { YarleOptions } from './YarleOptions';
import { processNode } from './process-node';
import { isWebClip } from './utils/note-utils';
import { loggerInfo } from './utils/loggerInfo';
import { SymmetricHash } from './utils/symmetric-hash';

import {
  hasCreationTimeInTemplate,
  hasLinkToOriginalInTemplate,
  hasLocationInTemplate,
  hasNotebookInTemplate,
  hasSourceURLInTemplate,
  hasTagsInTemplate,
  hasUpdateTimeInTemplate
} from './utils/templates/checker-functions';
import { defaultTemplate } from './utils/templates/default-template';
import { OutputFormat } from './output-format';
import { clearLogFile } from './utils/clearLogFile';
import { promisify } from 'util';
import * as https from 'https';

export const defaultYarleOptions: YarleOptions = {
  downloadImages: true,
  enexSources: ['notebook.enex'],
  outputDir: './mdNotes',
  keepOriginalHtml: false,
  isMetadataNeeded: false,
  isNotebookNameNeeded: false,
  isZettelkastenNeeded: false,
  plainTextNotesOnly: false,
  skipWebClips: false,
  useHashTags: true,
  nestedTags: {
    separatorInEN: '_',
    replaceSeparatorWith: '/',
    replaceSpaceWith: '-',
  },
  outputFormat: OutputFormat.StandardMD,
  urlEncodeFileNamesAndLinks: false,
  pathSeparator: '/',
  resourcesDir: '_resources',
  turndownOptions: {
    headingStyle: 'atx',
  },
};

export const yarleGlobalData = {
  pendingImages: new SymmetricHash()
};

export let yarleOptions: YarleOptions = {...defaultYarleOptions};

const setOptions = (options: YarleOptions): void => {
  yarleOptions = merge({}, defaultYarleOptions, options);
  yarleGlobalData.pendingImages = new SymmetricHash();

  let template = (yarleOptions.templateFile) ? fs.readFileSync(yarleOptions.templateFile, 'utf-8') : defaultTemplate;
  template = yarleOptions.currentTemplate ? yarleOptions.currentTemplate : template;

  /*if (yarleOptions.templateFile) {*/
  // todo: handle file not exists error
  yarleOptions.skipCreationTime = !hasCreationTimeInTemplate(template);
  yarleOptions.skipLocation = !hasLocationInTemplate(template);
  yarleOptions.skipSourceUrl = !hasSourceURLInTemplate(template);
  yarleOptions.skipTags = !hasTagsInTemplate(template);
  yarleOptions.skipUpdateTime = !hasUpdateTimeInTemplate(template);
  yarleOptions.isNotebookNameNeeded = hasNotebookInTemplate(template);
  yarleOptions.keepOriginalHtml = hasLinkToOriginalInTemplate(template);

  yarleOptions.currentTemplate = template;

  loggerInfo(`Current config is: ${JSON.stringify(yarleOptions, null, 4)}`);
  loggerInfo(`Path separator:${path.sep}`);
  /*}*/
};

export const parseStream = async (options: YarleOptions, enexSource: string): Promise<void> => {
  loggerInfo(`Getting stream from ${enexSource}`);
  const stream = fs.createReadStream(enexSource);
  // const xml = new XmlStream(stream);
  let noteNumber = 0;
  let failed = 0;
  let skipped = 0;

  const notebookName = utils.getNotebookName(enexSource);

  return new Promise((resolve, reject) => {

    const logAndReject = (error: Error) => {
      loggerInfo(`Could not convert ${enexSource}:\n${error.message}`);
      ++failed;

      return reject();
    };
    if (!fs.existsSync(enexSource)) {
      return loggerInfo(JSON.stringify({name: 'NoSuchFileOrDirectory', message: 'source Enex file does not exists'}));
    }

    const xml = flow(stream);

    let noteAttributes: any = null;
    xml.on('tag:note-attributes', (na: any) => {
      noteAttributes = na;
    });

    xml.on('tag:note', (note: any) => {
      if (options.skipWebClips && isWebClip(note)) {
        ++skipped;
        loggerInfo(`Notes skipped: ${skipped}`);
      } else {
        if (noteAttributes) {
          // make sure single attributes are not collapsed
          note['note-attributes'] = noteAttributes;
        }
        processNode(note, notebookName);
        ++noteNumber;
        loggerInfo(`Notes processed: ${noteNumber}\n\n`);
      }
      noteAttributes = null;
    });

    xml.on('end', () => {
      const success = noteNumber - failed;
      const totalNotes = noteNumber + skipped;
      loggerInfo('==========================');
      loggerInfo(
        `Conversion finished: ${success} succeeded, ${skipped} skipped, ${failed} failed. Total notes: ${totalNotes}`,
      );

      return resolve();
    });
    xml.on('error', logAndReject);
    stream.on('error', logAndReject);
  });
};

const finished = promisify(stream.finished);

export async function downloadFile(fileUrl: string, outputLocationPath: string): Promise<any> {
  const writer = fs.createWriteStream(outputLocationPath);
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const response = await axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
    httpsAgent: agent,
    timeout: 1000 * 30,
  })
  response.data.pipe(writer);

  return finished(writer);
}

export const dropTheRope = async (options: YarleOptions): Promise<void> => {
  clearLogFile();
  setOptions(options);

  for (const enex of options.enexSources) {
    utils.setPaths(enex);
    await parseStream(options, enex);
  }

  loggerInfo(`Downloading ${yarleGlobalData.pendingImages.length} remaining images...`);

  for await(let [url, fileName] of yarleGlobalData.pendingImages.getAsEntries()) {
    loggerInfo(`Downloading ${url} to ${fileName}`);
    try {
      await downloadFile(url, fileName);
    } catch (error) {
      loggerInfo(`Could not download ${url}:\n${error.message}`);
    }
  }

  loggerInfo(`Finished downloading images`);

};
// tslint:enable:no-console
