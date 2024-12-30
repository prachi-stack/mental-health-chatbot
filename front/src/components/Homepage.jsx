import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate from React Router v6

const Homepage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Animation state for fade-in
  const [fadeIn, setFadeIn] = useState(false);

  // Trigger the fade-in animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 500); // Delay the fade-in effect
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Handle the button click to start chat
  const startChat = () => {
    navigate("/login"); // Navigate to the chat page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-300 to-pink-300 text-white relative overflow-hidden">
      {/* Parallax effect on background */}
 
      <div
        className={` mx-[2rem] xs:mx-[5rem] sm:mx-[6rem] text-center p-[2rem] sm:p-[3rem] max-w-xl bg-gray-50 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-105 ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
      >
        <h1 className="text-lg font-bold text-gray-800 mb-5 animate__animated animate__fadeIn animate__delay-1s">
          Welcome to Your Mental Health Assistant
        </h1>
        <p className="text-md text-gray-700 mb-8 max-w-lg mx-auto animate__animated animate__fadeIn animate__delay-1.2s">
          Struggling with your thoughts or feeling overwhelmed? I am here to listen and guide you through your emotions. Let’s start the conversation.
        </p>
        
        {/* Call to Action Button with Hover Animation */}
        <button
          onClick={startChat}
          className="p-2  bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 hover:scale-105 transition duration-300 transform"
        >
          Start Chatting
        </button>

        {/* Privacy Assurance */}
        <p className="mt-6 text-sm text-gray-600 max-w-lg mx-auto animate__animated animate__fadeIn animate__delay-1.4s">
          Your privacy is our priority. Share your thoughts in a safe space, and let's work together to support you.
        </p>
      </div>
    </div>
  );
};

export default Homepage;
