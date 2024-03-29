import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

import { GermanJsonData } from '@models/jsonTypes';
import { findRelativePathToData } from '@models/shared/readYaml';

import { createSeparableVerb, createVerb } from '@german/createGermanVerb';
import { buildAllSource } from '../../utilities/buildFromYml/readAllSources';

dotenv.config();

export type DataObj = {
  translations?: { [languageAbbr: string]: string | string[] };
  tags?: string[];
  hilfsverb?: string;
  partizip?: string;
  strong?: [string: boolean] | boolean;
  stems?: { [characterName: string]: string };
  irregular?: { [key: string]: { [person: string]: string } };
  'weak endings'?: boolean;
  'drop ich/es pr\u00e4sens endings'?: boolean;
};

const processVerbs = (data: { [x: string]: DataObj }): GermanJsonData => {
  const newJsonObj: GermanJsonData = {
    date: Date.now(),
    verbs: {},
  };

  for (const keyString in data) {
    if (Object.prototype.hasOwnProperty.call(data, keyString) && keyString !== 'date') {
      const newDataObj: DataObj = data[keyString];

      if (keyString.includes('|')) {
        const seperableVerbTuple = createSeparableVerb(keyString, newDataObj);
        if (seperableVerbTuple) {
          const [key, sepVerb] = seperableVerbTuple;
          newJsonObj.verbs[key] = sepVerb;
        }
      } else {
        newJsonObj.verbs[keyString] = createVerb(keyString, newDataObj);
      }
    }
  }

  newJsonObj.date = Date.now();

  return newJsonObj;
};

export function writeProcessedVerbsToFile(
  url: string,
  processedVerbs: GermanJsonData,
  _dataPath?: string,
) {
  let dataPath = _dataPath;
  if (!_dataPath) {
    dataPath = findRelativePathToData(__dirname);
  }
  const data: string = JSON.stringify(processedVerbs);
  fs.writeFileSync(path.join(dataPath, url), data);
}

const validKeys = [
  'language', 'translations', 'tags', 'partizip',
  'strong', 'stems', 'irregular', 'weak endings', 'hilfsverb',
  'drop ich/es pr\u00e4sens endings'];

export const germanTypeGuard = function germanType(x: object): x is DataObj {
  let returnValue = true;

  const xKeys = Object.keys(x);
  xKeys.forEach((key: string) => {
    if (!validKeys.includes(key)) {
      returnValue = false;
    }
  });

  return 'language' in x && returnValue;
};

export function germanVerbData() {
  try {
    const result = buildAllSource('german', germanTypeGuard);
    const processedVerbs = processVerbs(result);
    writeProcessedVerbsToFile('germanVerbsUnhydrated.json', processedVerbs);
    return processedVerbs;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error in germanverbs model: ${err as string} ${__dirname}`);
    const newJsonObj: GermanJsonData = {
      date: Date.now(),
      verbs: {},
    };
    return newJsonObj;
  }
}
