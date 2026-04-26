import api from './api';

export interface ExpenseData {
  _id: string;
  title: string;
  amount: number;
  category: 'Inventory' | 'Maintenance' | 'Other';
  date: string;
  userId: {
    _id: string;
    name: string;
  };
  householdId: string;
}

export interface ExpenseResponse {
  expenses: ExpenseData[];
  monthlyTotal: number;
}

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export default {
  getExpenses: (filters: ExpenseFilters = {}): Promise<{ data: ExpenseResponse }> => 
    api.get('/expenses', { params: filters }),
    
  addExpense: (data: Partial<ExpenseData>): Promise<{ data: ExpenseData }> => 
    api.post('/expenses', data),
    
  deleteExpense: (id: string): Promise<any> => 
    api.delete(`/expenses/${id}`)
};
