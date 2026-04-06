import React, { useEffect, useRef, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { sendMessage } from "../services/chatService";
import "./Chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");  // user input
  const [isTyping, setIsTyping] = useState(false);  // bot typing indicator
  const [isOpen, setIsOpen] = useState(false);  // control open/close
  const [messages, setMessages] = useState([{ 
    role: "bot", 
    content: "Hi there! How can I assist you today?" },
  ]);

  const chatBodyRef = useRef(null); // for auto scroll

  // Toggle chatbot open/close
  const toggleChat = () => setIsOpen((prev) => !prev);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Send message to backend and get reply
  const handleSend = async () => {
    const trimmed = input.trim();

    // prevent empty or duplicate sending
    if (!trimmed || isTyping) return;

    // add user message to UI
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    try {
      // call service instead of fetch
      const reply = await sendMessage(trimmed);

      // add bot reply
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: reply || "No response generated." },
      ]);
    } catch (error) {
      // fallback message if API fails
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, I couldn't respond at the moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Send on Enter key (without Shift)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Chatbot Assistant</span>
            <IoClose className="chat-close-icon" onClick={toggleChat} />
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}

            {/* typing animation */}
            {isTyping && (
              <div className="chat-msg bot typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping} // disable during response
            />
            <button onClick={handleSend} disabled={isTyping || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating chatbot button */}
      <button
        className={`chatbot-button ${isOpen ? "chat-open" : ""}`}
        onClick={toggleChat}
      >
        <FaRegCommentDots className="chat-icon" />
      </button>
    </>
  );
};

export default Chatbot;