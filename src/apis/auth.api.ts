import axios from 'axios';
import {
  GetTenantsRequestDto,
  GetTenantsResponseDto,
} from '../dtos/auth/get-tenants';
import {GetTokenRequestDto, GetTokenResponseDto} from '../dtos/auth/get-token';
import {BaseApi} from './base.api';

/**
 * @class AuthenticationApi
 * @description API for authenticating clients
 */
export class AuthenticationApi extends BaseApi {
  constructor(
    private readonly username: string | null,
    private readonly password: string | null,
    private readonly tenant_id?: string | null
  ) {
    super();
  }

  async selectTenant(tenant_id: string, company_id: string) {
    return this.getToken({
      username: this.username as string,
      password: this.password as string,
      tenant_id,
      company_id,
    }).then(token => {
      this.setAccessToken(token.access_token);
      return token;
    });
  }

  /**
   * Logs in with the given credentials
   *
   * @method login
   * @returns {Promise<void>} - The token
   * @throws {Error} - If the credentials are invalid
   * @returns {Promise<GetTokenResponseDto>} - The token
   * @throws {Error} - If the token could not be retrieved
   * @throws {Error} - If the credentials are invalid
   * @throws {Error} - If the tenant could not be found
   * @throws {Error} - If the company could not be found
   */
  async login(): Promise<GetTokenResponseDto> {
    return this.getTenants({
      username: this.username as string,
      password: this.password as string,
    }).then(tenants => {
      if (tenants.length === 0) {
        throw new Error('No tenants found');
      }

      if (this.tenant_id) {
        const tenant = tenants.find(
          tenant => tenant.tenant_id === this.tenant_id
        );

        if (!tenant) {
          throw new Error('Tenant not found');
        }

        return this.selectTenant(tenant.tenant_id, tenant.company_id);
      }

      return this.selectTenant(tenants[0].tenant_id, tenants[0].company_id);
    });
  }

  /**
   * Retrieves a list of tenants for the given credentials
   *
   * @method getTenants
   * @param {GetTenantsRequestDto} params - The query params for the request
   * @returns {Promise<GetTenantsResponseDto>} - The tenants
   * @throws {Error} - If the credentials are invalid
   * @throws {Error} - If the tenant could not be found
   * @throws {Error} - If the company could not be found
   */
  async getTenants({
    username,
    password,
  }: GetTenantsRequestDto): Promise<GetTenantsResponseDto> {
    /**
     * @constant {Object} data - The data for the request
     */
    const data = {
      username,
      password,
    };

    /**
     * @constant {AxiosResponse<GetTenantsResponseDto>} response - The response from the API
     */
    const response = await axios
      .post<GetTenantsResponseDto>(this.url('/core/latest/tenants'), data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch(e => {
        console.log(e);
        throw new Error(e);
      });

    return response.data;
  }

  /**
   * Retrieves a token for the given credentials
   *
   * @method getToken
   * @param {GetTokenRequestDto} params - The query params for the request
   * @returns {Promise<GetTokenResponseDto>} - The token
   * @throws {Error} - If the token could not be retrieved
   * @throws {Error} - If the credentials are invalid
   * @throws {Error} - If the tenant could not be found
   * @throws {Error} - If the company could not be found
   */
  async getToken({
    username,
    password,
    tenant_id,
    company_id,
  }: Omit<GetTokenRequestDto, 'grant_type'>): Promise<GetTokenResponseDto> {
    /**
     * @constant {Object} data - The data for the request
     */
    const data: GetTokenRequestDto = {
      username,
      password,
      tenant_id,
      company_id,
      grant_type: 'password',
    };

    /**
     * @constant {AxiosResponse<GetTokenResponseDto>} response - The response from the API
     */
    const response = await axios
      .post<GetTokenResponseDto>(this.url('/core/latest/token'), data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch(e => {
        throw new Error(e);
      });

    super.setAccessToken(response.data.access_token);

    return response.data;
  }
}
