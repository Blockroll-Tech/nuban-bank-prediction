const getBank = require("./get-bank");
const fintechs = require("./fintechs.json");
const { isValid } = require("./validatePhoneNumber");

/**
 * Predicts the possible banks for a given NUBAN or phone number.
 * If the input is a valid phone number, it returns a list of fintechs.
 * If the input is a NUBAN, it returns a list of matching banks, with popular banks prioritized.
 *
 * @param {string} input - The NUBAN or phone number to predict banks for.
 * @returns {Array<Object>} An array of bank/fintech objects.
 */
function getPredictedBanks(input) {
  if (!input) {
    // In a module, we should throw an error or return an empty array, not exit the process.
    throw new Error("Input (NUBAN or phone number) is required.");
  }

  const phone = isValid(`0${input}`);

  if (phone) {
    let fintechsToReturn = [...fintechs.data];
    if (input.startsWith("90") || input.startsWith("81")) {
      fintechsToReturn.push({
        "name": "MONIEPOINT MICROFINANCE BANK",
        "code": "50515"
      });
    }
    return fintechsToReturn;
  } else {
    let bank = getBank(input);

    const moniepointPrefixes = ["56", "54", "81", "50", "53", "55", "82", "63", "58", "57", "59", "65", "90"];
    const isMoniepointNuban = moniepointPrefixes.some(prefix => input.startsWith(prefix));

    const moniepointIndex = bank.findIndex(b => b.name === "MONIEPOINT MICROFINANCE BANK");

    if (moniepointIndex !== -1 && isMoniepointNuban) {
      const moniepointBank = bank.splice(moniepointIndex, 1)[0];
      bank.unshift(moniepointBank);
    }

    const popularBanks = [
      "OPAY",
      "MONIEPOINT MICROFINANCE BANK",
      "PAGA",
      "KUDA MICROFINANCE BANK",
      "PALMPAY",
      "UNITED BANK FOR AFRICA",
      "ECOBANK",
      "CARBON",
      "PROVIDUS BANK",
      "UNION BANK OF NIGERIA",
      "POLARIS BANK",
      "STERLING BANK",
      "TITAN-PAYSTACK",
      "9 Payment Service Bank",
      "ZENITH BANK",
      "FIRST BANK OF NIGERIA",
      "Fairmoney Microfinance Bank",
      "ACCESS BANK",
      "ACCESS(DIAMOND) BANK",
      "GTBANK PLC",
      "WEMA BANK",
      "SMARTCASH PAYMENT SERVICE BANK",
      "TITAN TRUST BANK",
    ];

    // Create a new array for sorted banks
    let sortedBank = [];

    // Add popular banks first, in their defined order
    popularBanks.forEach(pbName => {
      const foundIndex = bank.findIndex(b => b.name === pbName);
      if (foundIndex !== -1) {
        sortedBank.push(bank.splice(foundIndex, 1)[0]);
      }
    });

    // Add remaining banks
    sortedBank = sortedBank.concat(bank);

    return sortedBank;
  }
}

//console.log(getPredictedBanks("6364246565"));

module.exports = getPredictedBanks;