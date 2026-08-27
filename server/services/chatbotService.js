const { GoogleGenerativeAI } = require("@google/generative-ai");
const { hybridSearch } = require("../rag/hybridRetriever");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const instruction = `
You are the VoucherBank Assistant for the VoucherBank web platform.

Your job is to help users with VoucherBank-related questions using the provided knowledge base context.

Rules:
- Only answer questions related to VoucherBank.
- Use the provided knowledge base context as the source of truth.
- Do not invent VoucherBank features, instructions, policies, or information that are not supported by the context.
- Answer the user's question directly before providing additional details.
- When the user asks how to perform an action, provide clear step-by-step instructions.
- Start with the simplest and most direct method.
- Mention alternative methods afterward only when they are useful.
- Write answers assuming the user may be new to VoucherBank.
- Do not repeat unnecessary information from the context.
- If the context does not contain enough information to answer a VoucherBank question, say that you do not have information about it at the moment.
- Do not assume that something does not exist simply because it is not mentioned in the context.
- Be concise, clear, and helpful.
- Keep responses short and easy to read in a chat UI.
- Use plain text only.
- Do not use markdown symbols like **, *, #, or bullet formatting.
- If giving steps, use simple numbered lines like:
  1. Go to the Home page
  2. Click Redeem

Question handling:
- First determine whether the user's question is about VoucherBank based on the question itself, not based on whether relevant context was retrieved.
- If the question is about VoucherBank but the provided context does not contain enough information to answer it, reply:
  "I don't have information about that at the moment."
- If the question itself is unrelated to VoucherBank, reply exactly:
  "I'm here to assist with VoucherBank-related questions. I can't answer unrelated topics."
- Do not answer a different VoucherBank topic just because the retrieved context is unrelated to the user's question.
`;

/**
 * Convert retrieved chunks into context that Gemini can use.
 */
const buildContext = (chunks) => {
  if (!chunks.length) {
    return "No relevant VoucherBank information was found.";
  }

  return chunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}: ${chunk.source}, page ${chunk.page}]
${chunk.text}`
    )
    .join("\n\n");
};

/**
 * Generate a VoucherBank chatbot reply using hybrid RAG retrieval + Gemini.
 */
const generateChatReply = async (message) => {
  const cleanedMessage = message.trim();
  const lowerMessage = cleanedMessage.toLowerCase();

  // Handle simple courtesy messages without retrieval or a Gemini API call.
  const politeMessages = [
    "thank you",
    "thanks",
    "ok thanks",
    "okay thanks",
    "thanks a lot",
    "thank you so much",
    "got it",
    "noted",
    "alright thanks",
    "ty",
    "thx",
  ];

  if (politeMessages.includes(lowerMessage)) {
    return "You're welcome. Let me know if you need anything else about VoucherBank.";
  }

  /*
   * Retrieve the most relevant chunks.
   * Hybrid search combines semantic (dense) and keyword (sparse) retrieval.
   */
  const retrievedChunks = await hybridSearch(cleanedMessage, 5);

  // Temporary debug logs to check what the RAG pipeline retrieved.
  // console.log("\n===== RAG DEBUG =====");
  // console.log("Question:", cleanedMessage);

  // retrievedChunks.forEach((chunk, index) => {
  //   console.log(`\nResult ${index + 1}`);
  //   console.log("Source:", chunk.source);
  //   console.log("Page:", chunk.page);
  //   console.log("Hybrid Score:", chunk.hybridScore);
  //   console.log("Text:", chunk.text);
  // });

  // console.log("=====================\n");

  // Combine the retrieved chunks into context for Gemini.
  const context = buildContext(retrievedChunks);

  /*
   * Gemini receives the user's question together with
   * the relevant VoucherBank information retrieved by RAG.
   */
  const ragPrompt = `
${instruction}

VoucherBank knowledge base context:

${context}

User question:
${cleanedMessage}

Answer the user's question based on the knowledge base context above.
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(ragPrompt);
  const reply = result.response.text();

  return reply?.trim() || "Sorry, I couldn't generate a response.";
};

module.exports = {
  generateChatReply,
};