const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../backend/views/pdf/agreement.ejs');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all variations of Namita Rathore
content = content.replace(/Namita Rathore/gi, 'Anujay Chouhan');
content = content.replace(/Namita/gi, 'Anujay Chouhan');

// Replace all variations of Shubham Sharma
content = content.replace(/shubham sharma/gi, 'Anujay Chouhan');
content = content.replace(/subham sharma/gi, 'Anujay Chouhan');

// Replace old company names
content = content.replace(/the rapid investore/gi, 'Vishtara Capital Research');
content = content.replace(/rapid investore/gi, 'Vishtara Capital Research');
content = content.replace(/bharat stock/gi, 'Vishtara Capital Research');
content = content.replace(/STOCK MARKET RESEARCH/gi, 'Vishtara Capital Research');

// Ensure email is correct in case any got left behind
content = content.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (match) => {
    // If it's the new email, keep it
    if (match.toLowerCase() === 'chouhananujay@gmail.com') return match;
    // Otherwise replace
    return 'chouhananujay@gmail.com';
});

// Ensure phone is correct
content = content.replace(/(\+91[\s-]?)?[6789]\d{9}/g, (match) => {
    // Exclude the new number if it's there
    if (match.includes('86020') || match.includes('8602027324')) return match;
    return '+91 86020 27324';
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("Cleanup script executed on agreement.ejs");
