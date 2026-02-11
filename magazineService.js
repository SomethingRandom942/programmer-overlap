/**
 * magazineService.js
 * 
 * Contains all business logic related to magazines and users.
 * Includes:
 * - Validation
 * - Error handling
 * - Edge case protection
 */

/**
 * Validates the entire data structure.
 * Throws an error if structure is invalid.
 */
function validateDataStructure(data) {
  if (!data || typeof data !== "object") {
    throw new TypeError("Data must be a valid object.");
  }

  if (!Array.isArray(data.users)) {
    throw new TypeError("Data must contain a 'users' array.");
  }

  if (!Array.isArray(data.magazines)) {
    throw new TypeError("Data must contain a 'magazines' array.");
  }
}

/**
 * Renames a magazine safely.
 * 
 * @param {Object} data - The full data object (from JSON)
 * @param {number} magazineId - ID of the magazine to rename
 * @param {string} newTitle - New title for the magazine
 * 
 * @returns {Object} Updated data object
 */
function renameMagazine(data, magazineId, newTitle) {
  // Validate data structure
  validateDataStructure(data);

  // Validate magazineId
  if (typeof magazineId !== "number" || isNaN(magazineId)) {
    throw new TypeError("magazineId must be a valid number.");
  }

  // Validate newTitle
  if (typeof newTitle !== "string") {
    throw new TypeError("newTitle must be a string.");
  }

  const trimmedTitle = newTitle.trim();

  if (trimmedTitle.length === 0) {
    throw new Error("newTitle cannot be empty.");
  }

  if (trimmedTitle.length > 100) {
    throw new Error("newTitle is too long (max 100 characters).");
  }

  // Check if magazine exists
  const magazine = data.magazines.find(m => m.id === magazineId);

  if (!magazine) {
    throw new Error(`Magazine with ID ${magazineId} not found.`);
  }

  // Edge case: new title is same as current
  if (magazine.title === trimmedTitle) {
    console.warn("New title is the same as the current title.");
    return data;
  }

  // Check for duplicate title
  const duplicate = data.magazines.find(
    m => m.title.toLowerCase() === trimmedTitle.toLowerCase()
  );

  if (duplicate) {
    throw new Error("A magazine with this title already exists.");
  }

  // Perform update
  magazine.title = trimmedTitle;

  return data;
}

/**
 * Returns a user with full magazine objects resolved.
 * 
 * @param {Object} data 
 * @param {number} userId 
 * @returns {Object}
 */
function getUserWithMagazines(data, userId) {
  validateDataStructure(data);

  if (typeof userId !== "number" || isNaN(userId)) {
    throw new TypeError("userId must be a valid number.");
  }

  const user = data.users.find(u => u.id === userId);

  if (!user) {
    throw new Error(`User with ID ${userId} not found.`);
  }

  // Resolve magazine objects safely
  const subscribedMagazines = user.subscribedMagazineIds
    .map(id => data.magazines.find(m => m.id === id))
    .filter(Boolean); // Removes undefined if invalid IDs exist

  return {
    ...user,
    subscribedMagazines
  };
}

module.exports = {
  renameMagazine,
  getUserWithMagazines
};