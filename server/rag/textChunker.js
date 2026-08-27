/**
 * Split a long piece of text into overlapping chunks.
 *
 * @param {string} text - Text to split.
 * @param {number} chunkSize - Maximum words per chunk.
 * @param {number} overlap - Number of overlapping words.
 * @returns {string[]} Array of text chunks.
 */
const chunkText = (text, chunkSize = 700, overlap = 120) => {
  const words = text.split(/\s+/);
  const chunks = [];

  let start = 0;

  while (start < words.length) {
    const end = start + chunkSize;

    chunks.push(words.slice(start, end).join(" "));

    // Move forward while keeping an overlap between consecutive chunks.
    start += chunkSize - overlap;
  }

  return chunks;
};

/**
 * Split every document into chunks while preserving its metadata.
 *
 * @param {Array} documents
 * @returns {Array} Chunked documents.
 */
const chunkDocuments = (documents) => {
  const chunkedDocuments = [];
  let chunkId = 0;

  for (const document of documents) {
    const chunks = chunkText(document.text);

    for (const chunk of chunks) {
      chunkedDocuments.push({
        id: `chunk-${chunkId}`,
        source: document.source,
        page: document.page,
        text: chunk,
      });

      chunkId++;
    }
  }

  return chunkedDocuments;
};

module.exports = {
  chunkText,
  chunkDocuments,
};