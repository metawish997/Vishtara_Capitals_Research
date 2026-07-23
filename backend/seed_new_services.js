const axios = require('axios');

// const API_URL = 'http://localhost:5001/api/v1/services';
const API_URL = 'https://therapidinvestors.com/api/v1/services';

const hniDurations = [
    {
        duration: "Monthly",
        duration_type: "monthly",
        duration_months: 1,
        price: 53098
    },
    {
        duration: "3 Months",
        duration_type: "custom",
        duration_months: 3,
        price: 135698
    }
];

const mcxDurations = [
    {
        duration: "Monthly",
        duration_type: "monthly",
        duration_months: 1,
        price: 29498
    },
    {
        duration: "3 Months",
        duration_type: "custom",
        duration_months: 3,
        price: 74338
    },
    {
        duration: "Half Yearly",
        duration_type: "half_yearly",
        duration_months: 6,
        price: 141598
    }
];

const getFeatures = (name) => [
    { text: `Premium ${name} Calls` },
    { text: "Intraday & Positional Trading Calls" },
    { text: "Dedicated Relationship Manager" },
    { text: "Live Market Support" },
    { text: "Research Reports" },
    { text: "Priority WhatsApp Support" }
];

const servicesToAdd = [
    {
        name: "HNI Services",
        tagline: "Exclusive high net-worth individual trading service with a dedicated relationship manager and bespoke research.",
        status: true,
        sort_order: 8,
        button_text: "Subscribe Now",
        durations: hniDurations.map(d => ({ ...d, features: getFeatures('HNI') }))
    },
    {
        name: "MCX Premium",
        tagline: "Advanced commodities market trading service focused on Gold, Silver, Crude Oil and Natural Gas.",
        status: true,
        sort_order: 9,
        button_text: "Subscribe Now",
        durations: mcxDurations.map(d => ({ ...d, features: getFeatures('Commodities') }))
    }
];

async function seedServices() {
    for (const service of servicesToAdd) {
        try {
            console.log(`Adding ${service.name}...`);
            await axios.post(API_URL, service);
            console.log(`Success: ${service.name} added.`);
        } catch (error) {
            console.error(`Error adding ${service.name}:`, error.message);
        }
    }
    console.log("All services processed.");
}

seedServices();
