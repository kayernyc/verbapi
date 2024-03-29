import { GermanVerb, GermanTenses, GermanPronounKeys } from '@german/germanTypes';
import { seinDataObject } from '@german/spec/specConstants';
import { DataObj } from '../../germanBuildJsonFromYml';

import createIrregularVerbFeatures from '../createIrregularVerbFeatures';

describe('verbIsIrregular correctly determines the state of the verb', () => {
  it('populates sein correctly', () => {
    const newVerb: GermanVerb = {
      language: 'de',
      drop: false,
      hilfsverb: 'sein',
      infinitive: 'sein',
      translations: { en: 'to be' },
    };

    const expected: GermanVerb = {
      language: 'de',
      drop: false,
      hilfsverb: 'sein',
      infinitive: 'sein',
      translations: { en: 'to be' },
      partizip: 'gewesen',
      strong: true,
      stems: { präteritum: 'war', konjunktiv: 'sei' },
      irregular: {
        [GermanTenses.präsens]: {
          [GermanPronounKeys.ich]: 'bin',
          [GermanPronounKeys.du]: 'bist',
          [GermanPronounKeys.es]: 'ist',
          [GermanPronounKeys.wir]: 'sind',
          [GermanPronounKeys.ihr]: 'seid',
        },
      }
      ,
    };

    const result = createIrregularVerbFeatures({ newVerb, dataObj: seinDataObject });
    expect(result).toEqual(expected);
  });

  it('populates können correctly', () => {
    const english = 'can, may, are able to, to know how';

    const newVerb: GermanVerb = {
      language: 'de',
      drop: true,
      hilfsverb: 'haben',
      infinitive: 'können',
      translations: { en: english },
    };

    const könnenObj: DataObj = {
      translations:
        { en: english },
      tags: ['modal'],
      'weak endings': true,
      strong: true,
      stems: { 'präsens singular': 'a', präteritum: 'o' },
      'drop ich/es präsens endings': true,
    };

    const expected: GermanVerb = {
      language: 'de',
      drop: true,
      hilfsverb: 'haben',
      infinitive: 'können',
      translations: { en: english },
      strong: true,
      stems: { präsensSingular: 'a', präteritum: 'o' },
      weakEndings: true,
    };

    const result = createIrregularVerbFeatures({ newVerb, dataObj: könnenObj });
    expect(result).toEqual(expected);
  });

  it('populates sollen correctly', () => {
    const english = 'to be expected to';

    const newVerb: GermanVerb = {
      language: 'de',
      drop: true,
      hilfsverb: 'haben',
      infinitive: 'sollen',
      translations: { en: english },
    };

    const sollenObj: DataObj = {
      translations: { en: english },
      tags: ['modal'],
      strong: true,
      'drop ich/es präsens endings': true,
    };

    const expected: GermanVerb = {
      language: 'de',
      drop: true,
      hilfsverb: 'haben',
      infinitive: 'sollen',
      translations: { en: english },
      strong: true,
    };

    const result = createIrregularVerbFeatures({ newVerb, dataObj: sollenObj });
    expect(result).toEqual(expected);
  });

  it('populates werden correctly', () => {
    const english = 'to become, to grow';

    const newVerb: GermanVerb = {
      language: 'de',
      drop: false,
      hilfsverb: 'sein',
      infinitive: 'werden',
      translations: { en: english },
    };

    const verbObj: DataObj = {
      translations:
        { en: english },
      tags: ['hilfsverb'],
      hilfsverb: 'sein',
      partizip: 'o',
      strong: true,
      stems: { präteritum: 'u', partizip: 'o' },
      irregular: {
        präsens: {
          du: 'wirst',
          es: 'wird',
        },
      },
    };

    const expected: GermanVerb = {
      language: 'de',
      drop: false,
      hilfsverb: 'sein',
      infinitive: 'werden',
      translations: { en: english },
      partizip: 'o',
      strong: true,
      stems: { partizip: 'o', präteritum: 'u' },
      irregular: {
        [GermanTenses.präsens]: {
          [GermanPronounKeys.du]: 'wirst',
          [GermanPronounKeys.es]: 'wird',
        },
      }
      ,
    };

    const result = createIrregularVerbFeatures({ newVerb, dataObj: verbObj });
    expect(result).toEqual(expected);
  });
});
