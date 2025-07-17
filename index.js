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
        "name": "Moniepoint MFB",
        "code": "50515"
      });
    }
    return fintechsToReturn;
  } else {
    let bank = getBank(input);

    const moniepointPrefixes = ["56", "54", "81", "50", "53", "55", "82", "63", "58", "57", "59", "65", "90"];
    const isMoniepointNuban = moniepointPrefixes.some(prefix => input.startsWith(prefix));

    const moniepointIndex = bank.findIndex(b => b.name === "Moniepoint MFB");

    if (moniepointIndex !== -1 && isMoniepointNuban) {
      const moniepointBank = bank.splice(moniepointIndex, 1)[0];
      bank.unshift(moniepointBank);
    }

    const popularBanks = [
      "OPay Digital Services Limited (OPay)",
      "Moniepoint MFB",
      "Paga",
      "Kuda Bank",
      "PalmPay",
      "United Bank For Africa",
      "Ecobank Nigeria",
      "Carbon",
      "Providus Bank",
      "Union Bank of Nigeria",
      "Polaris Bank",
      "Sterling Bank",
      "Paystack-Titan",
      "9mobile 9Payment Service Bank",
      "Zenith Bank",
      "First Bank of Nigeria",
      "Fairmoney Microfinance Bank",
      "Access Bank",
      "Access Bank (Diamond)",
      "Guaranty Trust Bank",
      "Wema Bank",
      "Airtel Smartcash PSB",
      "Titan Bank",
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

//console.log(getPredictedBanks("0056666716"));

module.exports = getPredictedBanks;