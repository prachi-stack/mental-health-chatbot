import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [userMessage, setUserMessage] = useState(""); // User's message
  const [messages, setMessages] = useState([]); // List of chat messages
  const [loading, setLoading] = useState(false); // Loading state
  const [emotion, setEmotion] = useState(""); // To store the detected emotion
  const [chatStarted, setChatStarted] = useState(false); // Track if chat has started

  // Handle input change
  const handleChange = (e) => {
    setUserMessage(e.target.value);
  };

  // Handle sending the message
  const handleSendMessage = async () => {
    if (!userMessage) return; // If there's no user message, do nothing.

    // Append the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", message: userMessage },
    ]);
    setLoading(true); // Set loading state to true while waiting for the response
    setChatStarted(true); // Mark chat as started after user sends a message

    // Send the user's message to the backend
    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: userMessage,
      });

      // After receiving the response, update the chat with the bot's reply and detected emotion
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: response.data.message },
      ]);
      setEmotion(response.data.emotion); // Save the detected emotion
      setUserMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: "Sorry, something went wrong. Please try again." },
      ]);
    }

    setLoading(false); // Set loading state to false after response
  };

  return (
    <div className="min-h-screen min-w-screen bg-blue-950 pt-[7rem]">
    <div className="relative min-w-screen mx-[2rem] xs:mx-[4rem] sm:mx-[6rem] md:mx-[9rem] lg:mx-[17rem] p-6 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 shadow-lg rounded-lg">
      <div className="relative z-10"> {/* Ensure chat UI is on top of background */}
        <h2 className="text-xl text-center font-bold mb-6 text-indigo-900">Chatbot for Better Days</h2>

        <div className="h-80 overflow-y-scroll mb-4 rounded-xl bg-gray-100 shadow-md relative">
          {/* Soothing message */}
          {!chatStarted && (
            <div className="absolute inset-0 flex items-center justify-center text-red-400 text-md font-semibold opacity-80 z-20">
              <p className="text-center px-[1rem] xs:px-[3rem]">You're not alone. Let's talk and work through it together 💖</p>
            </div>
          )}

          {/* Display chat messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-4 mr-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block p-3 rounded-xl text-sm ${
                  msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black ml-3 mr-6"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center mt-2">
              <span className="animate-pulse text-gray-500">...</span>
            </div>
          )}
        </div>

        {emotion && (
          <div className="text-center mb-4 text-md font-medium text-purple-600">
            <strong>Detected Emotion:</strong> {emotion}
          </div>
        )}

        <div className="flex bg-gray-50 rounded-xl shadow-md mt-4 p-2">
          <input
            type="text"
            value={userMessage}
            onChange={handleChange}
            placeholder="Type your message..."
            className="w-full  p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chat;
