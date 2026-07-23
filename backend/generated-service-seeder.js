
const axios = require('axios');

// const API_URL = 'http://localhost:5001/api/v1/services';
const API_URL = 'https://therapidinvestors.com/api/v1/services';

const servicesToAdd = [
    {
        "name": "Basic Stock Cash",
        "tagline": "Simple and professional cash market trading support with quality stock recommendations and regular market updates.",
        "featured": false,
        "status": true,
        "sort_order": 1,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 17698,
                "features": [
                    {
                        "text": "Daily Cash Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 84958,
                "features": [
                    {
                        "text": "Daily Cash Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 44838,
                "features": [
                    {
                        "text": "Daily Cash Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "Premium Stock Cash",
        "tagline": "Advanced cash market trading service for serious traders looking for premium stock recommendations, stronger research support, and better market opportunities.",
        "featured": false,
        "status": true,
        "sort_order": 1,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 23598,
                "features": [
                    {
                        "text": "Premium Cash Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 102658,
                "features": [
                    {
                        "text": "Premium Cash Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 58998,
                "features": [
                    {
                        "text": "Premium Cash Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "Basic Stock Option",
        "tagline": "Essential stock option trading service for beginners looking for daily option calls and research support.",
        "featured": false,
        "status": true,
        "sort_order": 3,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 17698,
                "features": [
                    {
                        "text": "Daily Stock Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 44838,
                "features": [
                    {
                        "text": "Daily Stock Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 84958,
                "features": [
                    {
                        "text": "Daily Stock Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "Premium Stock Option",
        "tagline": "Advanced stock option trading service for serious traders requiring premium calls and priority support.",
        "featured": false,
        "status": true,
        "sort_order": 4,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 23598,
                "features": [
                    {
                        "text": "Premium Stock Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 58998,
                "features": [
                    {
                        "text": "Premium Stock Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 102658,
                "features": [
                    {
                        "text": "Premium Stock Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "Basic Index Option",
        "tagline": "Essential index option trading service for Nifty and BankNifty options traders.",
        "featured": false,
        "status": true,
        "sort_order": 5,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 17698,
                "features": [
                    {
                        "text": "Daily Index Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 44838,
                "features": [
                    {
                        "text": "Daily Index Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 84958,
                "features": [
                    {
                        "text": "Daily Index Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "Premium Index Option",
        "tagline": "Advanced index option trading service with premium calls on Nifty and BankNifty and priority support.",
        "featured": false,
        "status": true,
        "sort_order": 6,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 23598,
                "features": [
                    {
                        "text": "Premium Index Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 58998,
                "features": [
                    {
                        "text": "Premium Index Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 102658,
                "features": [
                    {
                        "text": "Premium Index Option Calls"
                    },
                    {
                        "text": "Intraday Trading Calls"
                    },
                    {
                        "text": "Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Research Support"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "TRI Combo Option",
        "tagline": "The ultimate all-in-one trading package including premium cash, stock option, and index option calls.",
        "featured": false,
        "status": true,
        "sort_order": 7,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 40118,
                "features": [
                    {
                        "text": "Premium Cash Calls"
                    },
                    {
                        "text": "Premium Stock Option Calls"
                    },
                    {
                        "text": "Premium Index Option Calls"
                    },
                    {
                        "text": "Intraday & Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 95579,
                "features": [
                    {
                        "text": "Premium Cash Calls"
                    },
                    {
                        "text": "Premium Stock Option Calls"
                    },
                    {
                        "text": "Premium Index Option Calls"
                    },
                    {
                        "text": "Intraday & Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 141598,
                "features": [
                    {
                        "text": "Premium Cash Calls"
                    },
                    {
                        "text": "Premium Stock Option Calls"
                    },
                    {
                        "text": "Premium Index Option Calls"
                    },
                    {
                        "text": "Intraday & Swing Trading Calls"
                    },
                    {
                        "text": "Market Updates"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "HNI Services",
        "tagline": "Exclusive high net-worth individual trading service with a dedicated relationship manager and bespoke research.",
        "featured": false,
        "status": true,
        "sort_order": 8,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 53098,
                "features": [
                    {
                        "text": "Premium HNI Calls"
                    },
                    {
                        "text": "Intraday & Positional Trading Calls"
                    },
                    {
                        "text": "Dedicated Relationship Manager"
                    },
                    {
                        "text": "Live Market Support"
                    },
                    {
                        "text": "Research Reports"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 135698,
                "features": [
                    {
                        "text": "Premium HNI Calls"
                    },
                    {
                        "text": "Intraday & Positional Trading Calls"
                    },
                    {
                        "text": "Dedicated Relationship Manager"
                    },
                    {
                        "text": "Live Market Support"
                    },
                    {
                        "text": "Research Reports"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            }
        ]
    },
    {
        "name": "MCX Premium",
        "tagline": "Advanced commodities market trading service focused on Gold, Silver, Crude Oil and Natural Gas.",
        "featured": false,
        "status": true,
        "sort_order": 9,
        "button_text": "Subscribe Now",
        "durations": [
            {
                "duration": "Monthly",
                "duration_type": "monthly",
                "duration_months": 1,
                "price": 29498,
                "features": [
                    {
                        "text": "Premium Commodities Calls"
                    },
                    {
                        "text": "Intraday & Positional Trading Calls"
                    },
                    {
                        "text": "Dedicated Relationship Manager"
                    },
                    {
                        "text": "Live Market Support"
                    },
                    {
                        "text": "Research Reports"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "3 Months",
                "duration_type": "custom",
                "duration_months": 3,
                "price": 74338,
                "features": [
                    {
                        "text": "Premium Commodities Calls"
                    },
                    {
                        "text": "Intraday & Positional Trading Calls"
                    },
                    {
                        "text": "Dedicated Relationship Manager"
                    },
                    {
                        "text": "Live Market Support"
                    },
                    {
                        "text": "Research Reports"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            },
            {
                "duration": "Half Yearly",
                "duration_type": "half_yearly",
                "duration_months": 6,
                "price": 141598,
                "features": [
                    {
                        "text": "Premium Commodities Calls"
                    },
                    {
                        "text": "Intraday & Positional Trading Calls"
                    },
                    {
                        "text": "Dedicated Relationship Manager"
                    },
                    {
                        "text": "Live Market Support"
                    },
                    {
                        "text": "Research Reports"
                    },
                    {
                        "text": "Priority WhatsApp Support"
                    }
                ]
            }
        ]
    }
];

async function seedServices() {
    for (const service of servicesToAdd) {
        try {
            console.log(`Adding ${service.name}...`);
            await axios.post(API_URL, service);
            console.log(`Success: ${service.name} added.`);
        } catch (error) {
            console.error(
                `Error adding ${service.name}:`,
                error.response?.data || error.message
            );
        }
    }

    console.log('All services processed.');
}

seedServices();
