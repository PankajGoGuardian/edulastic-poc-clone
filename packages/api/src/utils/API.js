import axios from 'axios';
import Storage from './Storage';

export default class API {
  constructor(baseURL = 'http://edulastic-poc.snapwiz.net/api') {
    this.baseURL = baseURL;
    this.storage = new Storage();

    axios.defaults.headers.common.Authorization = this.storage.token;

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  callApi({ method = 'get', ...rest }) {
    return this.instance({ method, ...rest });
  }
}
