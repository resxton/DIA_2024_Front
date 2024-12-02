import { Api } from './Api';

export const api = new Api({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true, // Включаем отправку кук
});