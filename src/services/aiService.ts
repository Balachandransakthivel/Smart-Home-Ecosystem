import api from './api';

export default {
  getSuggestions: (inventoryData: any) => 
    api.post('/ai/suggestions', { inventoryData }),
    
  // Added for future use
  predictLowInventory: (inventoryData: any) => 
    api.post('/ai/predictions', { inventoryData }),

  getDeviceRecommendations: (deviceData: { usage_history: number[], room_occupancy?: boolean }) =>
    api.post('/ai/recommend', deviceData)
};
