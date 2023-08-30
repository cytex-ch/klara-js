import {AuthenticationApi} from '../../src/apis/auth.api';
import * as config from '../../src/config';

const {username, password, tenant_id} = config;

jest.setTimeout(30000);

describe('AuthenticationApi', () => {
  const api = new AuthenticationApi(username, password, tenant_id);

  it('should return a list of tenants', async () => {
    const response = await api.tenants();

    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty('tenant_id');
    expect(response[0]).toHaveProperty('company_id');
    expect(response[0]).toHaveProperty('company_name');
  });

  it('can get token', async () => {
    const tenants = await api.tenants();

    const response = await api.getToken({
      username: username,
      password: password,
      tenant_id: tenant_id,
      company_id: tenants.find(tenant => tenant.tenant_id === tenant_id)
        ?.company_id as string,
    });

    expect(response).toHaveProperty('access_token');
    expect(response).toHaveProperty('refreshToken');
    expect(response).toHaveProperty('expires_in');
    expect(response).toHaveProperty('token_type');
    expect(response).toHaveProperty('refresh_expires_in');
  });
});
