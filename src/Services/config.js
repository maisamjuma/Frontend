const ENV = process.env.REACT_APP_ENV || 'development'; // Use 'development' as default

const BASE_URLS = {
    development: 'http://localhost:8080/api',
    production: 'http://10.10.30.77:8080/api',
};

export const REST_API_BASE_URL = BASE_URLS[ENV];
