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
  /**
   * Retrieves letters from the letterbox
   *
   * @method getLetters
   * @param params {GetLettersQueryParams} - The query params for the request
   * @returns {Promise<GetLettersResponseDto>} - The letters
   */
  async getLetters(
    params: GetLettersQueryParams
  ): Promise<GetLettersResponseDto> {
    /**
     * @constant {AxiosResponse<GetLettersResponseDto>} response - The response from the API
     */
    const response = await axios
      .get<GetLettersResponseDto>(
        this.url(
          '/epost/v2/letters',
          GetLettersQueryParams.validateAndTransform(params)
        ),
        {
          headers: {
            ...super.getAuthorizationHeader(),
          },
        }
      )
      .catch(e => {
        throw new Error(e);
      });

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
  async getLetter(id: string): Promise<GetLetterResponseDto> {
    /**
     * @constant {AxiosResponse<GetLetterResponseDto>} response - The response from the API
     */
    const response = await axios
      .get<GetLetterResponseDto>(this.url('/epost/v2/letters/:id', {}, {id}), {
        headers: {
          ...super.getAuthorizationHeader(),
        },
      })
      .catch(e => {
        throw new Error(e);
      });

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
  async deleteLetter(id: string): Promise<void> {
    const response = await axios
      .delete<void>(this.url('/epost/v2/letters/:id', {}, {id}), {
        headers: {
          ...super.getAuthorizationHeader(),
        },
      })
      .catch(e => {
        throw new Error(e);
      });

    return response.data;
  }

  async getLetterContent(id: string): Promise<Buffer> {
    const response = await axios
      .get(this.url('/epost/v2/letters/:id/content', {}, {id}), {
        headers: {
          ...super.getAuthorizationHeader(),
          Accept: 'application/octet-stream',
        },
        responseType: 'arraybuffer',
      })
      .catch(e => {
        throw new Error(e);
      });

    return response.data;
  }

  async downloadLetter(id: string, path: string): Promise<void> {
    const content = await this.getLetterContent(id);
    writeFileSync(path, content);
  }
}
