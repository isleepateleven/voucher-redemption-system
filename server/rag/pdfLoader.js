const fs = require("fs");
const path = require("path");
const pdfjs = require("pdfjs-dist/legacy/build/pdf.mjs");

/**
 * Load all PDFs from the knowledge folder.
 * Returns an array of documents:
 * [
 *   {
 *     source,
 *     page,
 *     text
 *   }
 * ]
 */
const loadPDFs = async (pdfFolder) => {
  const documents = [];

  const files = fs.readdirSync(pdfFolder);

  for (const filename of files) {
    if (!filename.toLowerCase().endsWith(".pdf")) continue;

    const filePath = path.join(pdfFolder, filename);

    // Read the PDF into memory
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjs.getDocument({ data }).promise;

    // Process every page separately
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent();

      const text = content.items
        .map((item) => item.str)
        .join(" ")
        .trim();

      if (!text) continue;

      documents.push({
        source: filename,
        page: pageNumber,
        text,
      });
    }
  }

  return documents;
};

module.exports = { loadPDFs };