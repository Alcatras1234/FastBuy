import axios from "axios";

export const instance = axios.create({
    baseURL: "http://45.145.4.240:8080",
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});