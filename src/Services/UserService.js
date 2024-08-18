import axios from "axios";

// const REST_API_BASE_URL = process.env.REST_API_URL;
const REST_API_BASE_URL = 'http://10.10.30.77:8080/api/users';

/*
export const listUsers =()=>{
     return axios.get(REST_API_BASE_URL);
 }
*/


export const listUsers = () => axios.get(REST_API_BASE_URL);
export const createUser = (user) => axios.post(REST_API_BASE_URL, user);
export const getUser = (userId) => axios.get(REST_API_BASE_URL + '/' + userId);