import Klara from '../../src';

import * as config from '../../src/config';

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
    klara.init();

    const tenants = await klara.user.tenants();

    expect(tenants).toBeDefined();
    expect(tenants.length).toBeGreaterThan(0);
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
