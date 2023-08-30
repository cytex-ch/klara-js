/**
 * @file
 * @name index.ts
 * @desc Klara class for authentication and letterbox functionality.
 */

import {AuthenticationApi} from './apis/auth.api';
import {LetterboxApi} from './apis/epost.api';
import {GetTokenResponseDto} from './dtos/auth/get-token';

/**
 * Represents the Klara class.
 */
export default class Klara {
  private readonly username: string;
  private readonly password: string;

  private authenticationApi: AuthenticationApi | null = null;
  private letterboxApi: LetterboxApi | null = null;

  /**
   * Constructs a new instance of the Klara class.
   * @param {string} username - The username.
   * @param {string} password - The password.
   */
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.init();
  }

  /**
   * Initializes the AuthenticationApi and LetterboxApi instances.
   * @private
   */
  public init(): void {
    this.authenticationApi = new AuthenticationApi(
      this.username,
      this.password
    );
    this.letterboxApi = new LetterboxApi();
  }

  /**
   * Sets the tenant to use for API requests.
   *
   * @param tenant - The tenant to use.
   */
  public use(tenant: {tenant_id: string; company_id: string} | string) {
    if (typeof tenant === 'string') {
      this.authenticationApi?.use(tenant);
    } else {
      this.authenticationApi?.use(tenant);
    }
  }

  /**
   * Logs in with the given credentials.
   */
  async login(): Promise<GetTokenResponseDto> {
    return this.authenticationApi!.login();
  }

  /**
   * Gets the AuthenticationApi instance.
   * @public
   * @returns {AuthenticationApi} The AuthenticationApi instance.
   */
  public get user(): AuthenticationApi {
    return this.authenticationApi as AuthenticationApi;
  }

  /**
   * Gets the LetterboxApi instance.
   * @public
   * @returns {LetterboxApi} The LetterboxApi instance.
   */
  public get letterbox(): LetterboxApi {
    return this.letterboxApi as LetterboxApi;
  }
}
