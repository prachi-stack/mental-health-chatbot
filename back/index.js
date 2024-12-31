import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { HfInference } from '@huggingface/inference'; // Import Hugging Face API client

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://mental-health-chatbotfront.onrender.com',  // Replace with your Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],       // Allow necessary HTTP methods
}));
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Routes
// Auth Routes
import authRoutes from './routes/auth.js';
//import chatRoutes from './routes/chat.js';

app.use('/auth', authRoutes);  // Authentication routes (Login & Signup)
//app.use('/api/chat', chatRoutes);  // Chat route (For Hugging Face interaction)

const client = new HfInference("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"); // Hugging Face API client

// Chat Route (Handle message from user and send a response via Hugging Face)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;  // Get the user message from the request

  try {
    // 1. Send the message to the Hugging Face emotion detection model
    const emotionResponse = await client.textClassification({
      model: 'bhadresh-savani/bert-base-uncased-emotion', // Emotion detection model
      inputs: message,
    });

    // Extract detected emotion from Hugging Face's response
    const detectedEmotion = emotionResponse[0]?.label || 'neutral'; // Default to 'neutral' if no emotion detected

    // 2. Send the message to the Hugging Face chat completion model for generating a bot response
    const chatCompletion = await client.chatCompletion({
      model: 'mistralai/Mistral-Nemo-Instruct-2407',  // Choose the appropriate model for chatbot
      messages: [
        {
          role: 'user',  // The sender role
          content: `${message} give 5 short lines helpful advice to overcome problem`,  // User's message
        },
      ],
      max_tokens: 500,  // Limit the response length
    });

    // Extract the chatbot response
    const botMessage = chatCompletion.choices[0].message.content;
    console.log(botMessage);

    // Send both the bot's message and the detected emotion back to the client
    res.json({ message: botMessage, emotion: detectedEmotion });
  } catch (error) {
    console.error('Error fetching response from Hugging Face:', error);
    res.status(500).json({ message: 'Error fetching response from chatbot' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
