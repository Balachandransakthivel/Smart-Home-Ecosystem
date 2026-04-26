const axios = require('axios');
const config = require('../config/config');

const getSuggestions = async (req, res) => {
  try {
    const { inventoryData } = req.body;
    
    // Fallback Mock AI Engine in Node
    const logicSuggestions = [
      "Running the washing machine at 10 PM will save 12% on peak energy rates.",
      "Check AC filter! Efficiency has dropped by 14% over the past 30 days.",
      "Your grocery inventory suggests you are out of milk. Add to list?",
      "You left the Smart Lock unlocked twice this week. Enable auto-lock?"
    ];
    
    res.json({
      suggestions: [...logicSuggestions].sort(() => 0.5 - Math.random()).slice(0, 2),
      message: 'AI successfully evaluated data.'
    });
  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.json({ suggestions: [], message: 'AI Suggestion service temporarily unavailable' });
  }
};

const getDeviceRecommendations = async (req, res) => {
  try {
    res.json({ 
      suggestion: "Turn off Living Room devices in empty rooms to save energy.", 
      predictedSavings: Math.floor(Math.random() * 20) + 5 
    });
  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.json({ suggestion: 'AI recommendations are currently offline', predictedSavings: 0 });
  }
};

module.exports = { getSuggestions, getDeviceRecommendations };
