import api from './api';

const getMaintenance = () => api.get('/maintenance');
const addMaintenance = (maintenance) => api.post('/maintenance', maintenance);

export default { getMaintenance, addMaintenance };
