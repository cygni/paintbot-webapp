import axios, { AxiosResponse } from 'axios';
import { ApiUrlV1 } from '../common/config';

export async function loginV1(username: string, password: string) {
  return axios
    .post(`${ApiUrlV1}/authenticate`, { username: username, password: password })
    .then((response: AxiosResponse<string>) => {
      localStorage.setItem('token', response.data);
      return Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject('Login failed. Check your details and try again.');
    });
}
