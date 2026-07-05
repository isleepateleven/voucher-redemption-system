import React, { useEffect, useRef, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { sendMessage } from "../services/chatService";

const Chatbot = () => {
  const [input, setInput] = useState(""); // user input
  const [isTyping, setIsTyping] = useState(false); // bot typing indicator
  const [isOpen, setIsOpen] = useState(false); // control open/close
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hi there! How can I assist you today?",
    },
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

  const messageClass = (role) =>
    role === "user"
      ? "mb-[0.6rem] max-w-[75%] self-end break-words rounded-[18px] rounded-tr text-right bg-[#6b5ca5] px-4 py-[0.6rem] text-[0.77rem] leading-[1.4] text-white"
      : "mb-[0.6rem] max-w-[75%] self-start break-words rounded-[18px] rounded-tl bg-[#f1f1f1] px-4 py-[0.6rem] text-[0.77rem] leading-[1.4] text-[#333]";

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-[95px] right-6 z-[1001] flex h-[480px] w-[380px] flex-col rounded-2xl bg-white text-[0.8rem] shadow-[0_20px_24px_rgba(0,0,0,0.3)] max-[480px]:bottom-[85px] max-[480px]:left-4 max-[480px]:right-4 max-[480px]:h-[65vh] max-[480px]:w-[calc(100vw-32px)]">
          <div className="flex items-center justify-between bg-[#6b5ca5] px-4 py-[0.8rem] text-[0.9rem] font-semibold text-white">
            <span>Chatbot Assistant</span>
            <IoClose
              className="cursor-pointer text-xl"
              onClick={toggleChat}
            />
          </div>

          <div
            className="flex flex-grow flex-col overflow-y-auto bg-[#f9f9f9] p-[0.9rem]"
            ref={chatBodyRef}
          >
            {messages.map((msg, i) => (
              <div key={i} className={messageClass(msg.role)}>
                {msg.content}
              </div>
            ))}

            {/* typing animation */}
            {isTyping && (
              <div className="mb-[0.6rem] mt-1 flex h-4 max-w-[75%] items-center gap-1 self-start rounded-[18px] rounded-tl bg-[#f1f1f1] px-4 py-[0.6rem]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#aaa]"></span>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#aaa] [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#aaa] [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          <div className="flex border-t border-[#ddd] bg-white p-3 text-xs">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping} // disable during response
              className="mr-2 flex-grow rounded-full border border-[#ccc] px-4 py-2 text-[0.8rem] outline-none"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="cursor-pointer rounded-full border-none bg-[#6b5ca5] px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#8a79d6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating chatbot button */}
      <button
        className={`fixed bottom-6 right-6 z-[1000] flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-none bg-[#6b5ca5] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform hover:scale-105 hover:shadow-[0_0_12px_#6b5ca5,inset_0_0_8px_#6b5ca5] max-[480px]:bottom-4 max-[480px]:right-4 max-[480px]:h-[54px] max-[480px]:w-[54px] ${
          isOpen ? "scale-105" : ""
        }`}
        onClick={toggleChat}
      >
        <FaRegCommentDots className="text-2xl max-[480px]:text-xl" />
      </button>
    </>
  );
};

export default Chatbot;