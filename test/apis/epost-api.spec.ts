import path = require('path');
import axios from 'axios';
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

  describe('it should set proper query params', () => {
    it('can find letters without parameters', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async (url: string) => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find();
    });

    it('can find letters with limit parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async (url: string) => {
        // url has to contain either limit=0 or limit=1
        expect(url).toMatch(/limit=(0|1)/);

        return Promise.resolve({data: []});
      });
      await letterbox.find({
        limit: 1,
      });

      await expect(letterbox.find({limit: 1000})).rejects.toThrowError(
        /The limit can not be greater than 100./
      );

      await expect(letterbox.find({limit: -20})).rejects.toThrowError(
        /The limit can not be less than 1./
      );
    });

    it('can find letters with offset parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async (url: string) => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?offset=1&letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({
        offset: 1,
      });

      await expect(letterbox.find({offset: -1})).rejects.toThrowError(
        /The offset can not be less than 0./
      );
    });

    it('should use the default folder parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async url => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({});
    });

    it('can find letters with letter folder parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async url => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?letter-folder=SENT_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({
        'letter-folder': 'SENT_FOLDER',
      });
    });

    it('can find letters with senderCaseId parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async url => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?senderCaseId=foobar&letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({
        senderCaseId: 'foobar',
      });
    });

    it('can find letters with senderEndToEndId parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async url => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?senderEndToEndId=foobar&letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({
        senderEndToEndId: 'foobar',
      });
    });

    it('can find letters with senderUserId parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async url => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?senderUserId=foobar&letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({
        senderUserId: 'foobar',
      });
    });

    it('can find letters with senderParticipantId parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async url => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?senderParticipantId=foobar&letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({
        senderParticipantId: 'foobar',
      });
    });

    it('can find letters with date range parameter', async () => {
      // mock axios get
      axios.get = jest.fn().mockImplementation(async (url: string) => {
        expect(url).toBe(
          'https://api.klara.ch/epost/v2/letters?from-date=2020-01-01&to-date=2020-01-02&letter-folder=INBOX_FOLDER'
        );

        return Promise.resolve({data: []});
      });

      await letterbox.find({
        'from-date': '2020-01-01',
        'to-date': '2020-01-02',
      });

      await letterbox.find({
        'from-date': new Date('2020-01-01'),
        'to-date': new Date('2020-01-02'),
      });

      await expect(
        letterbox.find({
          'from-date': 'foobar',
        })
      ).rejects.toThrowError();

      await expect(
        letterbox.find({
          'to-date': 'foobar',
        })
      ).rejects.toThrowError();
    });
  });

  /**
  it('can delete one letter', async () => {
    return;

    await letterbox.deleteLetter(letter!.id);
    await expect(letterbox.getLetter(letter!.id)).rejects.toThrowError();
  });
  */
});
