#!/usr/bin/env node

/**
 * Documentation Collector Script
 *
 * This script collects all markdown documentation files from the /src directory only
 * and combines them into a single text file to be used by AI agents for process building.
 *
 * Usage: npm run build:docs
 */

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "build");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "corezoid-documentation-for-ai.txt");
const MARKDOWN_EXTENSION = ".md";
const SRC_DIR = path.join(__dirname, "..", "src");

if (!fs.existsSync(OUTPUT_DIR)) {
  console.log(`Creating output directory: ${OUTPUT_DIR}`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Find all markdown files in the src directory recursively
 * @param {string} dir - Directory to search in (must be within src)
 * @param {Array} fileList - Accumulator for found files
 * @returns {Array} List of markdown file paths
 */
function findMarkdownFiles(dir, fileList = []) {
  if (!dir.startsWith(SRC_DIR)) {
    console.log(`Skipping directory outside of /src: ${dir}`);
    return fileList;
  }
  
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith(MARKDOWN_EXTENSION)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Process a markdown file and format it for the output
 * @param {string} filePath - Path to the markdown file
 * @returns {string} Formatted content with header
 */
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const baseFilename = path.basename(filePath, MARKDOWN_EXTENSION);
  const parentDir = path.dirname(filePath);
  
  let headerTitle;
  
  if (baseFilename.toLowerCase() === 'readme') {
    if (parentDir === SRC_DIR) {
      headerTitle = "Src Readme";
    } else {
      const parentDirName = path.basename(parentDir);
      const capitalizedParentDirName = parentDirName.charAt(0).toUpperCase() + parentDirName.slice(1);
      headerTitle = `${capitalizedParentDirName} Readme`;
    }
  } else {
    headerTitle = baseFilename.charAt(0).toUpperCase() + baseFilename.slice(1);
  }

  return `\n\n## ${headerTitle}\n\n${content}`;
}

try {
  console.log("Starting documentation collection process...");
  console.log(`Analyzing only the /src directory: ${SRC_DIR}`);

  const markdownFiles = findMarkdownFiles(SRC_DIR);
  console.log(`Found ${markdownFiles.length} markdown files in /src to process.`);

  let combinedContent = "# COREZOID DOCUMENTATION COLLECTION\n\n";
  combinedContent += `Generated on: ${new Date().toISOString()}\n`;
  combinedContent += `Total files: ${markdownFiles.length}\n\n`;
  combinedContent += "---\n\n";

  markdownFiles.forEach(file => {
    console.log(`Processing: ${file}`);
    combinedContent += processMarkdownFile(file);
  });

  fs.writeFileSync(OUTPUT_FILE, combinedContent);

  console.log(`Documentation collection complete! Output file: ${OUTPUT_FILE}`);
} catch (error) {
  console.error("Error processing documentation:", error);
  process.exit(1);
}
