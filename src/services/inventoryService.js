import api from './api';

const getInventory = () => api.get('/inventory');
const addInventory = (item) => api.post('/inventory', item);

export default { getInventory, addInventory };
