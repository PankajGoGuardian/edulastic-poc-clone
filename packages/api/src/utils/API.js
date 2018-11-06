import axios from 'axios';
import Storage from './Storage';

export default class API {
  constructor(
    baseURL = 'http://ec2-23-23-133-71.compute-1.amazonaws.com:3000/api'
  ) {
    this.baseURL = baseURL;
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
