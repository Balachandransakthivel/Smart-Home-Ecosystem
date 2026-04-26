import api from './api';

const getTasks = () => api.get('/tasks');
const createTask = (task) => api.post('/tasks', task);

export default { getTasks, createTask };
