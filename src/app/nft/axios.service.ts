import axios, { AxiosError } from 'axios';

const axiosService = axios.create({
  baseURL: 'https://api-mainnet.magiceden.dev',
});

axiosService.interceptors.request.use((config) => {
  config.headers['Accept-Encoding'] = 'application/json';
  return config;
});

axiosService.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.data) {
      console.log(error.response.data);
    }
    return Promise.reject(error);
  },
);

export default axiosService;
