import axios from 'axios';

export const privateAPI = axios.create({
	baseURL: process.env.BACKEND_URL,
});

export const publicAPI = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const internalAPI = axios.create({
	baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
	withCredentials: true,
});
