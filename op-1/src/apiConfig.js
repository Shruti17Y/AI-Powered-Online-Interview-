// Central API base URL configuration
// In production, defaults to your live Render backend URL
const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://ai-powered-online-interview.onrender.com')
).replace(/\/+$/, '');

export default API_BASE_URL;
