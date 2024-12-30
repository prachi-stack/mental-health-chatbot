import express from "express";
import { HfInference } from '@huggingface/inference'; // Import Hugging Face API client

const router = express.Router();

// Initialize Hugging Face Inference Client
const client = new HfInference(`hf_${process.env.HUGGINGFACE_API_KEY}`); // Set your Hugging Face API key

// Chat Route (Handle message from user and send a response)
router.post("/", async (req, res) => {
  const { message } = req.body; // Get the user's message from the request

  try {
    // Sending a message to the Hugging Face model for chat completion
    const chatCompletion = await client.chatCompletion({
      model: 'mistralai/Mistral-Nemo-Instruct-2407', // Choose the appropriate model
      messages: [
        {
          role: 'user', // The sender role
          content: `${message}`, // User's message
        },
      ],
      max_tokens: 500, // Limit the response length
    });

    // Extract the chatbot response and send it back to the client
    const botMessage = chatCompletion.choices[0].message;
    res.json({ message: botMessage }); // Send bot response to frontend
  } catch (error) {
    console.error('Error fetching response from Hugging Face:', error);
    res.status(500).json({ message: 'Error fetching response from chatbot' });
  }
});

export default router;
