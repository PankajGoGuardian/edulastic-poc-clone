import axios from 'axios';

const axiosInstanceConfig = {
  timeout: 60000,
  headers: { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmViYmM1ZTU4NTAyMmQ3MTI2ZDEzOTIiLCJpYXQiOjE1NDIxNzU5ODcsImV4cCI6MTU0NDc2Nzk4N30.RpXbWF3eGh43PGjMim2uCc7lYq_V5_VgNzXAuFSaqO0' }
};
const axiosInstance = axios.create(axiosInstanceConfig);

export default axiosInstance;
