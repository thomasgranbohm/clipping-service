import axios from 'axios';

export const privateAPI = axios.create({
	baseURL: process.env.BACKEND_URL,
});
