const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Define the path where the user ID will be stored
// Uses HOME for Unix-like systems or USERPROFILE for Windows
const USER_ID_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.currency-converter', 'user-id.txt');

/**
 * Ensures that the directory exists before attempting to write the file
 * Creates the directory if it doesn't exist
 * @param {string} filePath - The full path to check/create
 */
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

/**
 * Gets or creates a unique user ID
 * If an ID exists in the file, returns it
 * If no ID exists, generates a new UUID and saves it
 * @returns {string} The user's unique identifier
 * @throws {Error} If there's an error reading/writing the ID file
 */
function getUserId() {
  try {
    ensureDirectoryExists(USER_ID_FILE);
    
    if (fs.existsSync(USER_ID_FILE)) {
      return fs.readFileSync(USER_ID_FILE, 'utf8').trim();
    }

    // Generate new userId if it doesn't exist
    const userId = crypto.randomUUID();
    fs.writeFileSync(USER_ID_FILE, userId);
    return userId;
  } catch (error) {
    console.error('Error managing userId:', error);
    throw error;
  }
}

module.exports = { getUserId }; 