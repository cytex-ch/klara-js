import Klara from '../../src';

import * as config from '../../src/config';

jest.setTimeout(30000);

describe('Klara', () => {
  it('should be defined', () => {
    expect(Klara).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof Klara).toBe('function');
  });

  it('should set username and password', () => {
    const klara = new Klara('username', 'password');
    expect(klara).toHaveProperty('username');
    expect(klara).toHaveProperty('password');
  });

  it('should yield user and letterbox api', () => {
    const klara = new Klara('username', 'password');
    klara.init();

    expect(klara.user).toBeDefined();
    expect(klara.letterbox).toBeDefined();
  });

  it('should allow to get tenants', async () => {
    const klara = new Klara(config.username, config.password);
    const tenants = await klara.user.tenants();

    expect(tenants).toBeDefined();
    expect(tenants.length).toBeGreaterThan(0);
  });

  it('should allow to select tenant', async () => {
    const klara = new Klara(config.username, config.password);
    const tenants = await klara.user.tenants();

    klara.use(tenants[0]);
    expect(klara.user.tenantId).toBe(tenants[0].tenant_id);

    klara.use(tenants[1].tenant_id);
    expect(klara.user.tenantId).toBe(tenants[1].tenant_id);
  });

  it('should throw error if no tenant is found', async () => {
    const klara = new Klara(config.username, config.password);

    // mock AuthenticationApi.tenants()
    klara.user.tenants = jest.fn().mockResolvedValue([]);

    await expect(klara.login()).rejects.toThrow('No tenants found');
  });

  it('should throw error if tenant is not found', async () => {
    const klara = new Klara(config.username, config.password);

    // mock AuthenticationApi.tenants()
    klara.user.tenants = jest
      .fn()
      .mockResolvedValue([
        {tenant_id: 'tenant_id', company_id: 'company_id', company_name: ''},
      ]);

    klara.use('tenant_id_2');

    await expect(klara.login()).rejects.toThrow('Tenant not found');
  });

  it('should default to first tenant if no tenant is selected', async () => {
    const klara = new Klara(config.username, config.password);

    // mock AuthenticationApi.tenants()
    klara.user.tenants = jest.fn().mockResolvedValue([
      {tenant_id: 'tenant_id', company_id: 'company_id', company_name: ''},
      {tenant_id: 'tenant_id_2', company_id: 'company_id_2', company_name: ''},
    ]);

    klara.user.selectTenant = jest.fn().mockResolvedValue({
      access_token: '',
      expires_in: 0,
      refreshToken: '',
      refresh_expires_in: 0,
      token_type: '',
    });

    await klara.login();

    expect(klara.user.selectTenant).toHaveBeenCalledWith(
      'tenant_id',
      'company_id'
    );
  });

  it('should throw an error if credentials are invalid', async () => {
    const klara = new Klara(config.username, 'invalid_password');
    await expect(klara.login()).rejects.toThrow(
      /Request failed with status code 401/g
    );
  });

  it('should throw an error if querying tenants with invalid credentials', async () => {
    const klara = new Klara(config.username, 'invalid_password');
    await expect(klara.user.tenants()).rejects.toThrow(
      /Request failed with status code 401/g
    );
  });

  it('should allow to login', async () => {
    const klara = new Klara(config.username, config.password);

    const tenants = await klara.user.tenants();

    klara.use(tenants[0]);

    const token = await klara.login();

    expect(token).toBeDefined();
    expect(token).toHaveProperty('access_token');
    expect(token).toHaveProperty('refreshToken');
    expect(token).toHaveProperty('expires_in');
    expect(token).toHaveProperty('token_type');
    expect(token).toHaveProperty('refresh_expires_in');
  });
});
