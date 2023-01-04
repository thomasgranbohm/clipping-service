import axios from 'axios';

export const privateAPI = axios.create({
	baseURL: 'http://backend:1337',
});

export const publicAPI = axios.create({
	baseURL: '/api',
});
