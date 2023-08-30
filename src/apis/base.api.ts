/**
 * @class BaseApi
 * @description Represents a base class for making API requests.
 */
import axios, {AxiosResponse, CustomParamsSerializer} from 'axios';
import {URL} from 'url';

export class BaseApi {
  private static readonly KLARA_BASEL_URL = 'https://api.klara.ch';

  private static accessToken: string | null = null;
  private static username: string | null = null;
  private static password: string | null = null;

  constructor(username?: string, password?: string) {
    if (username && password) {
      BaseApi.username = username;
      BaseApi.password = password;
    }
  }

  /**
   * @function getAuthorizationHeader
   * @description Returns the authorization header for API requests.
   * @returns {Object} The authorization header.
   */
  public getAuthorizationHeader(): {Authorization: string} {
    return {
      Authorization: `Bearer ${BaseApi.accessToken}`,
    };
  }

  /**
   * @function setAccessToken
   * @description Sets the access token for API requests.
   * @param {string} accessToken - The access token to set.
   * @returns {void}
   */
  public setAccessToken(accessToken: string): void {
    BaseApi.accessToken = accessToken;
  }

  /**
   * @function url
   * @description Constructs the complete URL for making requests.
   * @param {string} path - The path of the API endpoint.
   * @param {Object} [queryParams={}] - The query parameters to include in the URL.
   * @param {Object} [pathParams={}] - The path parameters to include in the URL.
   * @returns {string} The complete URL.
   */
  public url(
    path: string,
    queryParams: object = {},
    pathParams: object = {}
  ): string {
    const url = new URL(path, BaseApi.KLARA_BASEL_URL);
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });
    Object.entries(pathParams).forEach(([key, value]) => {
      url.pathname = url.pathname.replace(`:${key}`, value as string);
    });

    return url.toString();
  }

  /**
   * @function fetch
   * @description Makes an API request.
   * @template Payload - The type of the request payload.
   * @template Result - The type of the response result.
   * @template QueryParams - The type of the query parameters.
   * @template PathParams - The type of the path parameters.
   * @template Method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param {string} path - The path of the API endpoint.
   * @param {Method} [method='GET'] - The HTTP method.
   * @param {QueryParams} [queryParams={}] - The query parameters.
   * @param {PathParams} [pathParams={}] - The path parameters.
   * @param {Payload} [data={}] - The request payload.
   * @returns {Promise<Result>} The response result.
   */
  public async fetch<
    Payload extends Record<string, unknown>,
    Result,
    QueryParams extends Record<string, unknown>,
    PathParams extends Record<string, unknown>,
    Method extends 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  >(
    path: string,
    method?: Method,
    queryParams?: QueryParams,
    pathParams?: PathParams,
    data?: Payload
  ): Promise<Result> {
    const headers = this.getAuthorizationHeader();

    const params = queryParams;

    /* istanbul ignore next */
    const paramsSerializer = (params: QueryParams) => {
      return Object.entries(params as {})
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    };

    const response = await axios
      .request<Payload, AxiosResponse<Result>>({
        url: this.url(path, queryParams, pathParams),
        method: method ?? 'GET',
        headers,
        data,
        ...((params && {params, paramsSerializer}) as Record<string, unknown>),
      })
      .then(response => response.data);

    return response;
  }
}
