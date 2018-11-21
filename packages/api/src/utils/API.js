import axios from 'axios';
import config from '../config';
import Storage from './Storage';

export default class API {
  constructor(baseURL = config.api) {
    this.baseURL = 'http://localhost:3000/api/';
    this.storage = new Storage();
    axios.defaults.headers.common.Authorization = this.storage.token;

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  callApi({ method = 'get', ...rest }) {
    return this.instance({ method, ...rest });
  }
}
