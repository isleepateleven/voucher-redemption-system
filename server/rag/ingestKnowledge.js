const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { loadPDFs } = require("./pdfLoader");
const { chunkDocuments } = require("./textChunker");
const {
  buildDenseIndex,
  hasDenseIndex,
} = require("./denseRetriever");
const { buildSparseIndex } = require("./sparseRetriever");

const KNOWLEDGE_FOLDER = path.join(__dirname, "../knowledge");

// Store the fingerprint of the PDFs used to build the current dense index.
const HASH_FILE = path.join(__dirname, "knowledgeHash.txt");

/**
 * Generate one hash representing the current knowledge PDFs.
 * If any PDF is added, removed, or modified, the hash will change.
 */
const generateKnowledgeHash = () => {
  const hash = crypto.createHash("sha256");

  const files = fs
    .readdirSync(KNOWLEDGE_FOLDER)
    .filter((file) => file.toLowerCase().endsWith(".pdf"))
    .sort();

  for (const file of files) {
    // Include the filename so adding/removing/renaming a PDF also changes the hash.
    hash.update(file);

    const filePath = path.join(KNOWLEDGE_FOLDER, file);
    const fileContent = fs.readFileSync(filePath);

    hash.update(fileContent);
  }

  return hash.digest("hex");
};

/**
 * Read the hash that was saved when the dense index was last built.
 */
const getSavedKnowledgeHash = () => {
  if (!fs.existsSync(HASH_FILE)) {
    return null;
  }

  return fs.readFileSync(HASH_FILE, "utf8").trim();
};

/**
 * Save the current knowledge hash after successfully building the dense index.
 */
const saveKnowledgeHash = (hash) => {
  fs.writeFileSync(HASH_FILE, hash);
};

/**
 * Load, chunk, and index the VoucherBank knowledge base.
 */
const ingestKnowledge = async () => {
  const currentHash = generateKnowledgeHash();
  const savedHash = getSavedKnowledgeHash();
  const denseIndexExists = await hasDenseIndex();

  // PDFs only need to be loaded and chunked once during this startup.
  const documents = await loadPDFs(KNOWLEDGE_FOLDER);
  const chunks = chunkDocuments(documents);

  /*
   * Rebuild the dense index when:
   * 1. No dense index exists yet, or
   * 2. The knowledge PDFs have changed.
   */
  const knowledgeChanged = currentHash !== savedHash;

  if (!denseIndexExists || knowledgeChanged) {
    console.log("Building VoucherBank knowledge base...");

    console.log(`Loaded ${documents.length} PDF pages.`);
    console.log(`Created ${chunks.length} chunks.`);

    // Dense embeddings are only regenerated when necessary.
    await buildDenseIndex(chunks);

    // Save the new hash only after the dense index builds successfully.
    saveKnowledgeHash(currentHash);

    console.log("Dense knowledge index ready.");
  } else {
    console.log("Knowledge PDFs unchanged. Reusing existing dense index.");
  }

  /*
   * Sparse index is stored only in Node memory,
   * so it must be rebuilt whenever the backend starts.
   */
  buildSparseIndex(chunks);

  console.log("Knowledge base ready.");
};

module.exports = {
  ingestKnowledge,
};