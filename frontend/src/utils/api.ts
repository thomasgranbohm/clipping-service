import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const privateAPI = axios.create({
	baseURL: publicRuntimeConfig.INTERNAL_BACKEND_URL,
});

export const publicAPI = axios.create({
	baseURL: publicRuntimeConfig.EXTERNAL_BACKEND_URL,
});
