import axios from "axios";

axios.defaults.baseURL = "https://localhost:8080";
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = (method, url, data) => {

    return axios({
        method: method,
        url: url,
        // headers: headers,
        data: data});
};