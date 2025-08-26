// Simple CORS proxy for Replicate API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/', (req, res) => {
  res.json({ status: 'CORS Proxy Server Running', ready: true });
});

// Proxy endpoint for Replicate API - handles original app format with polling
app.all('/api/replicate', async (req, res) => {
  try {
    // Get API key from environment variable
    const replicateApiKey = process.env.REPLICATE_API_KEY;
    if (!replicateApiKey) {
      console.error('❌ REPLICATE_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Get the model from the request body like the original app
    const model = req.body.model || 'bytedance/seedream-3';
    const replicateUrl = `https://api.replicate.com/v1/models/${model}/predictions`;
    
    // Prepare the body in the format Replicate expects - just the input field
    const requestBody = {
      input: req.body.input
    };
    
    console.log('🔄 Proxying request to:', replicateUrl);
    console.log('📝 Method:', req.method);
    console.log('📝 Model:', model);
    console.log('📝 Request Body for Replicate:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(replicateUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(requestBody) : undefined
    });
    
    const data = await response.json();
    
    console.log('✅ Response status:', response.status);
    if (response.status >= 400) {
      console.log('❌ Error response:', JSON.stringify(data, null, 2));
      res.status(response.status).json(data);
      return;
    }
    
    console.log('🎉 Success! Prediction ID:', data.id);
    
    // Poll for completion if this is a prediction that needs polling (same as original app)
    if (data.status === 'starting' || data.status === 'processing') {
      const predictionId = data.id;
      console.log('🔄 Polling for prediction completion:', predictionId);
      
      // Poll every 2 seconds for up to 4 minutes
      for (let i = 0; i < 120; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            'Authorization': `Bearer ${replicateApiKey}`,
          },
        });
        
        const pollData = await pollResponse.json();
        console.log(`🔍 Poll ${i+1}: Status = ${pollData.status}`);
        
        if (pollData.status === 'succeeded') {
          console.log('✅ Prediction completed successfully!');
          console.log('🖼️ Output:', pollData.output);
          res.json(pollData);
          return;
        } else if (pollData.status === 'failed' || pollData.status === 'canceled') {
          console.log('❌ Prediction failed:', pollData.error);
          res.status(500).json(pollData);
          return;
        }
      }
      
      // Timeout after 4 minutes
      console.log('⏰ Prediction timed out after 4 minutes');
      res.status(408).json({ error: 'Prediction timed out' });
    } else {
      // Return immediately if already completed
      res.json(data);
    }
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CORS proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying Replicate API calls to avoid CORS issues`);
  console.log(`✅ Ready to handle requests!`);
});
