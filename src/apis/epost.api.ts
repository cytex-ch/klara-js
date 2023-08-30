import axios from 'axios';
import {GetLetterResponseDto} from '../dtos/letterbox/get-letter';
import {GetLettersResponseDto} from '../dtos/letterbox/get-letters';
import {GetLettersQueryParams} from '../dtos/letterbox/get-letters-query-params';
import {BaseApi} from './base.api';
import {writeFileSync} from 'fs';

/**
 * @class AuthenticationApi
 * @description API for authenticating clients
 */
export class LetterboxApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Retrieves letters from the letterbox
   *
   * @method getLetters
   * @param params {GetLettersQueryParams} - The query params for the request
   * @returns {Promise<GetLettersResponseDto>} - The letters
   */
  async find(
    params: GetLettersQueryParams = {}
  ): Promise<GetLettersResponseDto> {
    const transFormedParams =
      GetLettersQueryParams.validateAndTransform(params);

    /**
     * @constant {AxiosResponse<GetLettersResponseDto>} response - The response from the API
     */
    const response = await axios.get<GetLettersResponseDto>(
      this.url('/epost/v2/letters', transFormedParams),
      {
        headers: {
          ...super.getAuthorizationHeader(),
        },
      }
    );

    return response.data;
  }

  /**
   * Retrieves a letter from the letterbox
   *
   * @method getLetter
   * @param id {string} - The id of the letter
   * @returns {Promise<GetLetterResponseDto>} - The letter
   * @throws {Error} - If the letter could not be found
   */
  async findOne(id: string): Promise<GetLetterResponseDto> {
    /**
     * @constant {AxiosResponse<GetLetterResponseDto>} response - The response from the API
     */
    const response = await axios.get<GetLetterResponseDto>(
      this.url('/epost/v2/letters/:id', {}, {id}),
      {
        headers: {
          ...super.getAuthorizationHeader(),
        },
      }
    );

    return response.data;
  }

  /**
   * Deletes a letter from the letterbox
   *
   * @method deleteLetter
   * @param id {string} - The id of the letter
   * @returns {Promise<void>} - The letter
   * @throws {Error} - If the letter could not be found
   */
  /* istanbul ignore next */
  async delete(id: string): Promise<void> {
    const response = await axios.delete<void>(
      this.url('/epost/v2/letters/:id', {}, {id}),
      {
        headers: {
          ...super.getAuthorizationHeader(),
        },
      }
    );

    return response.data;
  }

  async getContent(id: string): Promise<Buffer> {
    const response = await axios.get(
      this.url('/epost/v2/letters/:id/content', {}, {id}),
      {
        headers: {
          ...super.getAuthorizationHeader(),
          Accept: 'application/octet-stream',
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  }

  async download(id: string, path: string): Promise<void> {
    const content = await this.getContent(id);
    writeFileSync(path, content);
  }
}
