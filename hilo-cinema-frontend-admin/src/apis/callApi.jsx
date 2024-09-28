import axios from 'axios';

export default function callApi(endpoint, method = 'GET', body, token) {
    const config = {
        method,
        url: `http://localhost:8000${endpoint}`, // Cập nhật URL để phù hợp với cấu trúc của API Gateway
        data: body,
    };

    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
            'Site-Type': 'admin' // Sử dụng 'Site-Type' như trong cấu hình Middleware của API Gateway
        };
    }

    return axios(config)
        .then(response => response.data)
        .catch(err => {
            console.error('API call failed:', err);
            throw err;
        });
}
