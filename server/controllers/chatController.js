const { generateChatReply } = require("../services/chatbotService");

// Handle chatbot request
exports.chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generateChatReply(message.trim());

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate chatbot response." });
  }
};