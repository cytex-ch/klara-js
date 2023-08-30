import axios from 'axios';
import {BaseApi} from '../../src/apis/base.api';

jest.setTimeout(30000);

describe('BaseApi', () => {
  it('should be defined', () => {
    expect(BaseApi).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof BaseApi).toBe('function');
  });

  it('should yield authorization header', () => {
    const api = new BaseApi();

    api.setAccessToken('token');

    expect(api.getAuthorizationHeader()).toHaveProperty('Authorization');
    expect(api.getAuthorizationHeader().Authorization).toBe('Bearer token');
  });

  describe('fetch', () => {
    it('should default to GET', async () => {
      const api = new BaseApi();

      api.setAccessToken('token');

      jest.spyOn(axios, 'request');

      await api.fetch('https://httpbin.org/get');

      expect(axios.request).toHaveBeenCalledWith({
        url: 'https://httpbin.org/get',
        method: 'GET',
        headers: {
          Authorization: 'Bearer token',
        },
      });
    });
  });
});
