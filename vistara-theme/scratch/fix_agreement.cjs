const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../backend/views/pdf/agreement.ejs');
let content = fs.readFileSync(filePath, 'utf8');

// Replace contact person
content = content.replace(/Subham Sharma/g, 'Anujay Chouhan');

// Replace phone numbers
content = content.replace(/\+91 8269981108/g, '+91 86020 27324');

// Replace address
content = content.replace(/Madhya Pradesh 452001/g, 'H.no. C-20/1, Mahananda Nagar, Ujjain (M.P.), India');

// Replace email
content = content.replace(/namitarathore05071992@gmail\.com/g, 'chouhananujay@gmail.com');

// Replace old company name or seal
content = content.replace(/STOCK MARKET RESEARCH ANALYSIS/gi, 'Vishtara Capitals Research Analysis');
content = content.replace(/STOCK MARKET RESEARCH/gi, 'Vishtara Capitals Research Analysis');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Agreement EJS updated");
