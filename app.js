/**
 * app.js
 * 
 * Entry point of the application.
 * Loads JSON and uses the service functions.
 */

const fs = require("fs");
const path = require("path");
const { renameMagazine, getUserWithMagazines } = require("./magazineService");

// Load JSON file
const dataPath = path.join(__dirname, "data.json");
const rawData = fs.readFileSync(dataPath);
const data = JSON.parse(rawData);

try {
  // Rename a magazine
  renameMagazine(data, 101, "Tech World");

  // Get user with resolved magazines
  const user = getUserWithMagazines(data, 1);

  console.log("Updated User:");
  console.log(user);

  // Save updated JSON back to file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

} catch (error) {
  console.error("An error occurred:");
  console.error(error.message);
}