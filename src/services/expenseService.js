import api from './api';

const getExpenses = () => api.get('/expenses');
const addExpense = (expense) => api.post('/expenses', expense);

export default { getExpenses, addExpense };
