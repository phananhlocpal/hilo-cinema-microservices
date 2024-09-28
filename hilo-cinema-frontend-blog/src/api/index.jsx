import axios from 'axios';

/**
 * Makes an API call.
 * 
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (e.g., GET, POST).
 * @param {object} [body] - The body of the request (for POST, PUT, PATCH).
 * @param {string} [site='http://localhost:8000'] - The base URL for the API.
 * @param {string} [token] - The authorization token (if needed).
 * 
 * @returns {Promise} - The Axios promise for the API call.
 */
export default function callApi(endpoint, method = 'GET', body, token) {
    const config = {
        method,
        url: `http://localhost:8000/${endpoint}`,
        data: body,
    };

    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
            Site: `admin`
        };
    }

    return axios(config)
        .then(response => response.data)
        .catch(err => {
            console.error('API call failed:', err);
            throw err;
        });
}
