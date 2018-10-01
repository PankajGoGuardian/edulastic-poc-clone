import axios from 'axios';

export default class API {
  constructor(baseURL = 'http://localhost:9020') {
    this.baseURL = baseURL;

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
