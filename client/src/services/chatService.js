// const API = "http://localhost:5001/api/chat";
const API = `${process.env.REACT_APP_API_URL}/chat`;

// Send user message to chatbot backend and get reply
export const sendMessage = async (message) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }), // send message to backend
  });

  // Try to parse response safely
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "Chat request failed");
  }

  // Return chatbot reply
  return data.reply;
};