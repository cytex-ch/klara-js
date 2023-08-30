import {AuthenticationApi} from '../../src/apis/auth.api';
import {username, password, tenant_id} from '../../src/config';

jest.setTimeout(30000);

describe('AuthenticationApi', () => {
  const api = new AuthenticationApi(null, null, null);

  it('should return a list of tenants', async () => {
    const response = await api.getTenants({
      username: username,
      password: password,
    });

    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty('tenant_id');
    expect(response[0]).toHaveProperty('company_id');
    expect(response[0]).toHaveProperty('company_name');
  });

  it('should throw an error if the credentials are invalid', async () => {
    await expect(
      api.getTenants({
        username: username,
        password: 'invalid',
      })
    ).rejects.toThrowError();
  });

  it('can get token', async () => {
    const tenants = await api.getTenants({
      username: username,
      password: password,
    });

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
