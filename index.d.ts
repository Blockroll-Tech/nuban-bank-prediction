/**
 * Predicts the possible banks for a given NUBAN or phone number.
 * If the input is a valid phone number, it returns a list of fintechs.
 * If the input is a NUBAN, it returns a list of matching banks, with popular banks prioritized.
 *
 * @param {string} input - The NUBAN or phone number to predict banks for.
 * @returns {Array<{name: string, code: string}>} An array of bank/fintech objects.
 */
declare function getPredictedBanks(input: string): Array<{name: string, code: string}>;

declare namespace getPredictedBanks {
    // You can add more declarations here if your module exports other things
}

export = getPredictedBanks;
