// Central API base URL configuration
// In production (Vercel), set REACT_APP_API_URL in Vercel Environment Variables.
// In local development, it defaults to http://127.0.0.1:8000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export default API_BASE_URL;
