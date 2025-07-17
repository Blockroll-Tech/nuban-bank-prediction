const banks = require("./banks.json");

const seed = "373373373373373";
const nubanLength = 10;
const generateCheckDigit = (serialNumber, bankCode) => {
  // Clean bankCode (remove non-digits)
  let cleanedBankCode = bankCode.replace(/\D/g, '');

  let paddedBankCode = cleanedBankCode;

  if (paddedBankCode.length === 3) {
    paddedBankCode = "000" + paddedBankCode;
  } else if (paddedBankCode.length === 5) {
    paddedBankCode = "9" + paddedBankCode;
  }

  // Now, strictly validate that the final paddedBankCode is 6 digits.
  // This catches cases where original bankCode was not 3, 5, or 6 digits.
  if (paddedBankCode.length !== 6) {
    return -1; // Indicate invalid bank code for NUBAN calculation
  }

  let cipher = paddedBankCode + serialNumber;
  let sum = 0;

  // Step 1. Calculate A*3+B*7+C*3+D*3+E*7+F*3+G*3+H*7+I*3+J*3+K*7+L*3+M*3+N*7+O*3
  cipher.split("").forEach((item, index) => {
    sum += item * seed[index];
  });

  // Step 2: Calculate Modulo 10 of your result i.e. the remainder after dividing by 10
  sum %= 10;

  // Step 3. Subtract your result from 10 to get the Check Digit
  let checkDigit = 10 - sum;

  // Step 4. If your result is 10, then use 0 as your check digit
  checkDigit = checkDigit == 10 ? 0 : checkDigit;

  return checkDigit;
};

const isBankAccountValid = (accountNumber, bankCode) => {
  if (!accountNumber || accountNumber.length !== nubanLength) {
    return false;
  }

  let serialNumber = accountNumber.substring(0, 9);
  let checkDigit = generateCheckDigit(serialNumber, bankCode);

  return checkDigit === parseInt(accountNumber[9]);
};


const getBank = (nuban) => {
   
    let accountNumber =nuban;

    let accountBanks = [];

    banks.data.forEach((item) => {
      if (isBankAccountValid(nuban, item.code)) {
        accountBanks.push(item);
      }
    });

    return accountBanks;
  
};

module.exports = getBank;