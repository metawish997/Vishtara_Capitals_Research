const axios = require('axios');

const API_URL = 'http://localhost:5001/api/v1/banks';

const banksToAdd = [
    {
        bank_name: "Kotak Mahindra Bank",
        account_holder_name: "SHUBHAM SHARMA",
        account_number: "6450912931",
        account_type: "Current",
        ifsc_code: "KKBK0005984",
        branch_address: "INDORE-SCHEME 54",
        payment_type: "bank",
        is_active: true
    },
    {
        bank_name: "Axis Bank",
        account_holder_name: "The Rapid Investors",
        account_number: "924020033713655",
        account_type: "Current",
        ifsc_code: "UTIB0001724",
        payment_type: "bank",
        is_active: true
    }
];

async function seedBanks() {
    for (const bank of banksToAdd) {
        try {
            console.log(`Adding ${bank.bank_name} details...`);
            await axios.post(API_URL, bank);
            console.log(`Success: ${bank.bank_name} added.`);
        } catch (error) {
            console.error(`Error adding ${bank.bank_name}:`, error.message);
        }
    }
    console.log("All bank details processed.");
}

seedBanks();
