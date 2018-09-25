import axios from 'axios';
import config from '../../config';

const instance = axios.create({
  baseURL: config.baseAPIUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// instance.defaults.headers.common.Authorization = extractSession();

const callApi = ({ method = 'get', ...rest }) => instance({ method, ...rest });

export default callApi;
