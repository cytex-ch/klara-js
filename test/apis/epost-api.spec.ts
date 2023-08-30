import path = require('path');
import {randomUUID} from 'crypto';
import {existsSync, mkdirSync, rmSync} from 'fs';
import {AuthenticationApi} from '../../src/apis/auth.api';
import {LetterboxApi} from '../../src/apis/epost.api';
import * as config from '../../src/config';
import {GetLetterResponseDto} from '../../src/dtos/letterbox/get-letter';

const {username, password, tenant_id} = config;

jest.setTimeout(30000);

describe('ePost API', () => {
  const letterbox = new LetterboxApi();

  let letter: GetLetterResponseDto | null = null;

  beforeAll(async () => {
    await new AuthenticationApi(username, password, tenant_id).login();

    const tmpDir = path.join(__dirname, '../../tmp');
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir);
    }

    const letters = await letterbox.find({});
    letter = await letterbox.findOne(letters[0].id);
  });

  afterAll(async () => {
    if (existsSync(path.join(__dirname, '../../tmp'))) {
      rmSync(path.join(__dirname, '../../tmp'), {recursive: true});
    }
  });

  it('can get letters', async () => {
    const letters = await letterbox.find({});

    expect(letters).toBeDefined();
    expect(letters.length).toBeGreaterThan(0);
  });

  it('can get one letter', async () => {
    const foundLetter = await letterbox.findOne(letter!.id);

    expect(foundLetter).toBeDefined();
    expect(foundLetter.id).toBe(letter!.id);
  });

  it('can get buffer of one letter', async () => {
    const buffer = await letterbox.getContent(letter!.id);

    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('can download one letter', async () => {
    const tmpFile = path.join(__dirname, '../../tmp/' + randomUUID() + '.pdf');
    await letterbox.download(letter!.id, tmpFile);

    const exists = existsSync(tmpFile);

    expect(exists).toBe(true);
  });

  /**
  it('can delete one letter', async () => {
    return;

    await letterbox.deleteLetter(letter!.id);
    await expect(letterbox.getLetter(letter!.id)).rejects.toThrowError();
  });
  */
});
