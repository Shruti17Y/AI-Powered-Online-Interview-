// Central API base URL configuration
const defaultApiUrl = process.env.NODE_ENV === 'production'
  ? 'https://ai-powered-online-interview.onrender.com'
  : 'http://127.0.0.1:8000';

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || defaultApiUrl
).replace(/\/+$/, '');

export default API_BASE_URL;
