const { denseSearch } = require("./denseRetriever");
const { sparseSearch } = require("./sparseRetriever");

/**
 * Combine semantic and keyword retrieval results.
 */
const hybridSearch = async (question, topK = 5) => {
  // Retrieve the top matching chunks using both retrieval methods.
  const denseResults = await denseSearch(question, topK);
  const sparseResults = sparseSearch(question, topK);

  const merged = new Map();

  // Give dense results points based on their ranking.
  denseResults.forEach((result, index) => {
    merged.set(result.id, {
      ...result,
      hybridScore: topK - index,
    });
  });

  // Give sparse results points using the same ranking system.
  sparseResults.forEach((result, index) => {
    const sparseScore = topK - index;

    if (merged.has(result.id)) {
      // If dense retrieval already found this chunk, add its sparse score to its existing score.
      const existing = merged.get(result.id);
      existing.hybridScore += sparseScore;

    } else {
      // If only sparse retrieval found it, add it as a new result.
      merged.set(result.id, {
        ...result,
        hybridScore: sparseScore,
      });
    }
  });

  // Convert the Map back into an array, rank by combined score,and return only the top results.
  return Array.from(merged.values())
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, topK);
};

module.exports = {
  hybridSearch,
};