# NUBAN Bank Predictor

## Overview

In the Nigerian financial ecosystem, while many APIs provide account owner names based on bank and account number, there's a significant gap: the ability to suggest the corresponding bank solely from an account number. This library addresses that challenge by providing a robust solution to predict the likely bank(s) associated with a given NUBAN (Nigerian Uniform Bank Account Number) or even identify fintech platforms based on phone numbers.

## Problem Solved

Traditional bank account validation often requires both the bank code and the account number. This library fills a crucial need by allowing developers to determine potential banks when only the NUBAN is available, streamlining user experience and reducing friction in financial applications.

## Features

- **NUBAN to Bank Prediction**: Accurately predicts possible banks for a given 10-digit NUBAN using the official NUBAN check digit algorithm.
- **Fintech Identification (Phone Numbers)**: Identifies popular fintech platforms (like OPay, PalmPay, Moniepoint) when a valid Nigerian phone number is provided as input.
- **Smart Prioritization**: Intelligently prioritizes and orders suggested banks based on:
  - Specific Moniepoint NUBAN prefixes.
  - A predefined list of popular banks (e.g., Access Bank, Zenith Bank, UBA).
- **Comprehensive Bank Data**: Utilizes an up-to-date list of Nigerian banks and their codes.
- **Easy to Integrate**: Designed as a simple, importable JavaScript function.

## Installation

To install the library, use npm:

```bash
npm install nuban-prediction
```

## Usage

### Importing the Function

You can import the `getPredictedBanks` function into your JavaScript/Node.js project:

```javascript
const getPredictedBanks = require("nuban-prediction");
// Or for ES Modules:
// import getPredictedBanks from 'nuban-bank-predictor';
```

### NUBAN Prediction

Use a 10-digit NUBAN as input to get a list of possible banks. The list will be prioritized based on internal logic.

```javascript
const nuban = "0088064294"; // Example NUBAN for Access Bank
const possibleBanks = getPredictedBanks(nuban);
console.log(possibleBanks);
/*
Example Output (order may vary based on prioritization):
[
  { name: 'Access Bank', code: '044' },
  { name: 'First Bank of Nigeria', code: '011' },
  // ... other matching banks
]
*/

const moniepointNuban = "5600000011"; // Example NUBAN for Moniepoint
const moniepointResult = getPredictedBanks(moniepointNuban);
console.log(moniepointResult);
/*
Example Output:
[
  { name: 'Moniepoint MFB', code: '50515' },
  // ... other matching banks
]
*/
```

### Phone Number Prediction

Use a valid Nigerian phone number (e.g., `8012345678` or `9012345678`) as input to get a list of associated fintechs. Moniepoint will be added if the phone number starts with specific prefixes (`90`, `81`).

```javascript
const genericPhoneNumber = "8012345678";
const fintechs = getPredictedBanks(genericPhoneNumber);
console.log(fintechs);
/*
Example Output:
[
  { name: 'OPay Digital Services Limited (OPay)', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  // ... other base fintechs
]
*/

const moniepointPhoneNumber = "9012345678";
const moniepointFintechs = getPredictedBanks(moniepointPhoneNumber);
console.log(moniepointFintechs);
/*
Example Output:
[
  { name: 'OPay Digital Services Limited (OPay)', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  { name: 'Moniepoint MFB', code: '50515' }
  // ... other base fintechs
]
*/
```

### Output Structure

The function returns an array of objects. Each object represents a bank or fintech and has the following structure:

```javascript
{
  name: "Bank Name", // The full name of the bank/fintech
  code: "Bank Code"  // The bank/fintech code
}
```

## Prioritization Logic

When predicting banks for a NUBAN, the library applies the following prioritization:

1.  **Moniepoint Specific Prefixes**: If the NUBAN starts with certain prefixes (`56`, `54`, `81`, `50`, `53`, `55`, `82`, `63`, `58`, `57`, `59`, `65`, `90`) and "Moniepoint MFB" is a valid match, it will be moved to the very top of the list.
2.  **Popular Banks**: After the Moniepoint rule, a predefined list of popular banks (e.g., OPay, Kuda, UBA, Access Bank, Zenith Bank) are moved to the top of the list, maintaining their relative order.
3.  **Remaining Banks**: Any other banks that mathematically match the NUBAN will follow, in no specific order.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.
