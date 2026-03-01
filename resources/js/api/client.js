import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        Accept: 'application/json',
    },
});

const requiresCsrf = new Set(['post', 'put', 'patch', 'delete']);

api.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase();
    if (method && requiresCsrf.has(method)) {
        // Always refresh CSRF cookie before stateful mutating requests.
        // This avoids CSRF token mismatch when the session was rotated
        // (for example after login) or when multiple session cookies exist.
        const apiOrigin = typeof baseURL === 'string' ? baseURL.replace(/\/api\/?$/, '') : '';
        const csrfUrl = (apiOrigin || '') + '/sanctum/csrf-cookie';
        try {
            await axios.get(csrfUrl, { withCredentials: true });
        } catch (e) {
            // ignore; the subsequent request will surface the real error
        }
    }
    return config;
});

export default api;
