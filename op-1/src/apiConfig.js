// Central API base URL configuration
const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 'https://ai-powered-online-interview.onrender.com'
).replace(/\/+$/, '');

export default API_BASE_URL;
