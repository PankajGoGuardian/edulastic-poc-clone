import axios from 'axios';

const API = axios.create({
  baseURL: `https://edulastic-poc.snapwiz.net/api/`,
  headers: {
    "Content-Type": "application/json",
    "client-epoch": Date.now().toString(),
    'Authorization': localStorage.getItem('eduToken')
  }
});

export default API;

/**
 *  TODO: Add Logger & setup payload header structure: optional
 */