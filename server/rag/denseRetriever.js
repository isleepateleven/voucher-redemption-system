const path = require("path");
const { generateEmbedding } = require("./embeddingService");

const DB_PATH = path.join(__dirname, "lancedb");
const TABLE_NAME = "voucherbank_knowledge";

let db = null;
let table = null;

/**
 * Connect to the local LanceDB database.
 * Dynamic import keeps this compatible with your CommonJS Express project.
 */
const getDatabase = async () => {
  if (db) return db;

  const lancedb = await import("@lancedb/lancedb");
  db = await lancedb.connect(DB_PATH);

  return db;
};

/**
 * Open the existing knowledge table if it has already been created.
 */
const getTable = async () => {
  if (table) return table;

  const database = await getDatabase();
  const tableNames = await database.tableNames();

  if (!tableNames.includes(TABLE_NAME)) {
    throw new Error(
      "Dense index has not been created yet. Build the knowledge base first.",
    );
  }

  table = await database.openTable(TABLE_NAME);

  return table;
};

/**
 * Generate embeddings for all chunks and store them in LanceDB.
 * This runs when the knowledge base is first created or rebuilt.
 */
const buildDenseIndex = async (chunks) => {
  if (!chunks.length) {
    throw new Error("No chunks provided for dense indexing.");
  }

  const database = await getDatabase();

  const records = [];

  for (const chunk of chunks) {
    const vector = await generateEmbedding(chunk.text);

    records.push({
      id: chunk.id,
      source: chunk.source,
      page: chunk.page,
      text: chunk.text,
      vector,
    });
  }

  // Overwrite ensures rebuilding the knowledge base does not create duplicates.
  table = await database.createTable(TABLE_NAME, records, {
    mode: "overwrite",
  });

  console.log(`Dense index built with ${records.length} chunks.`);
};

/**
 * Retrieve chunks whose vectors are closest to the user's question.
 */
const denseSearch = async (question, topK = 5) => {
  const currentTable = await getTable();

  const questionVector = await generateEmbedding(question);

  const results = await currentTable
    .vectorSearch(questionVector)
    .limit(topK)
    .toArray();

  return results.map((result) => ({
    id: result.id,
    source: result.source,
    page: result.page,
    text: result.text,

    // LanceDB returns distance: smaller means more similar.
    distance: result._distance,
  }));
};

/**
 * Check whether a previously built dense index already exists.
 */
const hasDenseIndex = async () => {
  const database = await getDatabase();
  const tableNames = await database.tableNames();

  if (!tableNames.includes(TABLE_NAME)) {
    return false;
  }

  const existingTable = await database.openTable(TABLE_NAME);
  const count = await existingTable.countRows();

  return count > 0;
};

module.exports = {
  buildDenseIndex,
  denseSearch,
  hasDenseIndex,
};