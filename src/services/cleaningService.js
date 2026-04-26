import api from './api';

const getCleanings = () => api.get('/cleaning');
const createCleaning = (cleaning) => api.post('/cleaning', cleaning);

export default { getCleanings, createCleaning };
