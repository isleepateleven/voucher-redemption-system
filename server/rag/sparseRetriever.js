let sparseChunks = [];

// BM25 tuning parameters.
// These standard values work well as a starting point.
const K1 = 1.5;
const B = 0.75;

let averageDocumentLength = 0;

/**
 * Convert text into lowercase searchable words.
 */
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
};

/**
 * Store tokenized chunks in memory for BM25 sparse retrieval.
 */
const buildSparseIndex = (chunks) => {
  sparseChunks = chunks.map((chunk) => ({
    ...chunk,
    tokens: tokenize(chunk.text),
  }));

  // BM25 uses the average chunk length to avoid unfairly
  // favouring longer chunks that naturally contain more words.
  const totalTokens = sparseChunks.reduce(
    (total, chunk) => total + chunk.tokens.length,
    0,
  );

  averageDocumentLength =
    sparseChunks.length > 0
      ? totalTokens / sparseChunks.length
      : 0;

  console.log(`Sparse index built with ${sparseChunks.length} chunks.`);
};

/**
 * Count how many chunks contain a particular word.
 */
const getDocumentFrequency = (token) => {
  return sparseChunks.filter((chunk) =>
    chunk.tokens.includes(token),
  ).length;
};

/**
 * Search the sparse index using BM25 keyword ranking.
 *
 * BM25 considers:
 * - how often a query word appears in a chunk
 * - how rare that word is across all chunks
 * - the length of the chunk
 *
 * Higher score = more relevant keyword match.
 */
const sparseSearch = (question, topK = 5) => {
  if (!sparseChunks.length) {
    return [];
  }

  // Remove duplicate query words because each search term
  // only needs to contribute once to BM25 scoring.
  const queryTokens = [...new Set(tokenize(question))];

  const totalDocuments = sparseChunks.length;

  const scoredChunks = sparseChunks.map((chunk) => {
    let score = 0;

    for (const queryToken of queryTokens) {
      // Count how many times this query word appears in the chunk.
      const termFrequency = chunk.tokens.filter(
        (token) => token === queryToken,
      ).length;

      // No match means this word contributes nothing to this chunk.
      if (termFrequency === 0) {
        continue;
      }

      // Count how many chunks in the whole knowledge base contain this word.
      const documentFrequency = getDocumentFrequency(queryToken);

      /*
       * IDF gives more importance to rare words.
       *
       * For example, if "voucher" appears almost everywhere but
       * "expiry" appears in only a few chunks, "expiry" is more useful
       * for deciding which chunk is relevant.
       */
      const idf = Math.log(
        1 +
          (totalDocuments - documentFrequency + 0.5) /
            (documentFrequency + 0.5),
      );

      /*
       * BM25 term-frequency score.
       *
       * K1 controls how much repeated words increase the score.
       * B controls how much chunk length affects the score.
       */
      const lengthNormalization =
        1 -
        B +
        B * (chunk.tokens.length / averageDocumentLength);

      const termScore =
        idf *
        ((termFrequency * (K1 + 1)) /
          (termFrequency + K1 * lengthNormalization));

      score += termScore;
    }

    return {
      id: chunk.id,
      source: chunk.source,
      page: chunk.page,
      text: chunk.text,
      score,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0) // Remove chunks with no keyword matches
    .sort((a, b) => b.score - a.score) // Highest BM25 score first
    .slice(0, topK); // Return only the top results
};

/**
 * Check whether the in-memory sparse index has been built.
 */
const hasSparseIndex = () => {
  return sparseChunks.length > 0;
};

module.exports = {
  buildSparseIndex,
  sparseSearch,
  hasSparseIndex,
};