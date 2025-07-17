const assert = require('assert');
const getPredictedBanks = require('./index');
const fintechsData = require('./fintechs.json').data;

let testsPassed = 0;
let testsFailed = 0;

function runTest(name, testFunction) {
  try {
    testFunction();
    console.log(`✅ PASS: ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(error.message);
    testsFailed++;
  }
}

// --- NUBAN Tests ---

runTest("NUBAN: Should return Moniepoint at the top for specific prefixes", () => {
  const nuban = "5600000011"; // Valid NUBAN for Moniepoint MFB (code: 50515) starting with 56
  const result = getPredictedBanks(nuban);
  assert.ok(result.length > 0, "Should return at least one bank");
  assert.strictEqual(result[0].name, "Moniepoint MFB", "Moniepoint should be at the top");
});

runTest("NUBAN: Should prioritize popular banks", () => {
  const nuban = "0000000017"; // Valid NUBAN for Access Bank (code: 044)
  const result = getPredictedBanks(nuban);
  assert.ok(result.length > 0, "Should return at least one bank");
  const accessBank = result.find(b => b.name === "Access Bank");
  assert.ok(accessBank, "Access Bank should be in the list");
  // Check if Access Bank is among the first few, indicating prioritization
  assert.ok(result.slice(0, 5).some(b => b.name === "Access Bank"), "Access Bank should be prioritized near the top");
});

runTest("NUBAN: Should return all matching banks without arbitrary limit", () => {
  const nuban = "6175115121"; // Known to match multiple banks, including 9mobile 9Payment Service Bank
  const result = getPredictedBanks(nuban);
  assert.ok(result.length > 5, "Should return more than 5 banks if they match");
  assert.ok(result.some(b => b.name === "9mobile 9Payment Service Bank"), "9mobile 9Payment Service Bank should be in the list");
});

runTest("NUBAN: Should return an array for a non-matching NUBAN (may contain coincidental matches)", () => {
  const nuban = "1111111111"; // Unlikely to match a specific bank, but may have coincidental matches
  const result = getPredictedBanks(nuban);
  assert.ok(Array.isArray(result), "Should return an array");
  // We don't assert length 0 here, as coincidental matches are possible with the NUBAN algorithm.
});

runTest("NUBAN: Should handle NUBANs that are not 10 digits long", () => {
  const nuban = "12345"; // Invalid length
  const result = getPredictedBanks(nuban);
  assert.strictEqual(result.length, 0, "Should return an empty array for invalid NUBAN length");
});

// --- Phone Number Tests ---

runTest("Phone Number: Should return base fintechs for generic phone number", () => {
  const phoneNumber = "8012345678";
  const result = getPredictedBanks(phoneNumber);
  assert.deepStrictEqual(result, fintechsData, "Should return only base fintechs");
});

runTest("Phone Number: Should include Moniepoint for 90 prefix", () => {
  const phoneNumber = "9012345678";
  const result = getPredictedBanks(phoneNumber);
  assert.ok(result.some(f => f.name === "Moniepoint MFB"), "Should include Moniepoint MFB");
  assert.strictEqual(result.length, fintechsData.length + 1, "Should have one more fintech than base");
});

runTest("Phone Number: Should include Moniepoint for 81 prefix", () => {
  const phoneNumber = "8112345678";
  const result = getPredictedBanks(phoneNumber);
  assert.ok(result.some(f => f.name === "Moniepoint MFB"), "Should include Moniepoint MFB");
  assert.strictEqual(result.length, fintechsData.length + 1, "Should have one more fintech than base");
});

// --- Edge Cases ---

runTest("Edge Case: Should throw error for missing input", () => {
  assert.throws(() => getPredictedBanks(), Error, "Should throw an error for missing input");
  assert.throws(() => getPredictedBanks(null), Error, "Should throw an error for null input");
  assert.throws(() => getPredictedBanks(""), Error, "Should throw an error for empty string input");
});

console.log(`\n--- Test Summary ---\nPassed: ${testsPassed}\nFailed: ${testsFailed}`);

if (testsFailed > 0) {
  process.exit(1);
}