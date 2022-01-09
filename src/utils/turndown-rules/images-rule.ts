/* tslint:disable:no-console */
import { v4 } from 'uuid';
import { promises as fs_promises } from 'fs';
import fs from 'fs';

import { yarleGlobalData, yarleOptions } from '../../yarle';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { OutputFormat } from './../../output-format';
import * as path from 'path';

import { getFileExtension, getFileNameAndExtension } from '../filename-utils';
import { paths } from '../folder-utils';

// async function which uses node-fetch and downloads an image to a directory
// returns the path to the image
//
// async function downloadImage(url: string): Promise<void> {
//   try {
//     const localPath = `${v4()}${getFileExtension(url)}`;
//     const response = await fetch(url);
//     const buffer: Buffer = await response.buffer();
//
//     // const writeStream: fs.WriteStream = fs.createWriteStream(localPath);
//     await fs_promises.writeFile(localPath, buffer);
//
//   } catch (err) {
//     console.error(err);
//   }
//
// }

// Replaces img HTML tags with markdown image syntax
export const imagesRule = {
  filter: filterByNodeName('IMG'),
  replacement: (content: any, node: any) => {
    const nodeProxy = getAttributeProxy(node);

    if (!nodeProxy.src) {
      return '';
    }




    // const value = yarleOptions.rootNameOnly ? nodeProxy.src.value.split('/').pop() : nodeProxy.src.value;
    const value = nodeProxy.src.value;
    const widthParam = node.width || '';
    const heightParam = node.height || '';
    let realValue = yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(value) : value;

    // realValue = `${v4()}${getFileExtension(realValue)}`;
    console.log(`imagesRules running for source ${realValue}`);


    yarleOptions.downloadImages = true;
    // if src is http(s) url, fetch the image and download to local
    if (yarleOptions.downloadImages && value.toLocaleLowerCase().startsWith('http')) {
      const [rootName, ext] = getFileNameAndExtension(realValue);
      realValue = `${rootName}.${ext}`;
      let localFile = path.join(paths.resourcePath, realValue);

      // doesn't account for case sensitivity
      let index = 1;
      while (yarleGlobalData.pendingImages.containsValue(localFile) || fs.existsSync(localFile)) {
        realValue = `${rootName}-${++index}.${ext}`;
        localFile = path.join(paths.resourcePath, realValue);
      }

      yarleGlobalData.pendingImages.insert(value, localFile);
    }

    // while this isn't really a standard, it is common enough
    if (yarleOptions.keepImageSize === OutputFormat.StandardMD || yarleOptions.keepImageSize === OutputFormat.LogSeqMD) {
      const sizeString = (widthParam || heightParam) ? ` =${widthParam}x${heightParam}` : '';

      return `![](${realValue}${sizeString})`;
    } else if (yarleOptions.keepImageSize === OutputFormat.ObsidianMD) {
      const sizeString = (widthParam || heightParam) ? `|${widthParam}x${heightParam}` : '';

      return `![[${realValue}${sizeString}]]`;

    }

    const useObsidianMD = yarleOptions.outputFormat === OutputFormat.ObsidianMD;
    if (useObsidianMD && !value.match(/^[a-z]+:/)) {
      return `![[${realValue}]]`;
    }

    const srcSpl = nodeProxy.src.value.split('/');

    return `![${srcSpl[srcSpl.length - 1]}](${realValue})`;
  },
};
