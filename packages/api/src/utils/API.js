import axios from 'axios';
import config from '../config';
import Storage from './Storage';

export default class API {
  constructor(baseURL = config.api) {
    this.baseURL = baseURL;
    this.storage = new Storage();

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.instance.interceptors.request.use(config => {
      let token = this.storage.token;
      if (token) {
        config.headers['Authorization'] = token;
      }
      return config;
    });
  }

  callApi({ method = 'get', ...rest }) {
    return this.instance({ method, ...rest });
  }
}
