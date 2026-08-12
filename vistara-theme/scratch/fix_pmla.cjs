const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/policies/PmlaPolicy.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix compounded classes
content = content.replace(/text-slate-500 dark:text-slate-400 dark:text-slate-300 dark:text-slate-200/g, 'text-slate-800 dark:text-slate-200');
content = content.replace(/text-slate-500 dark:text-slate-400 dark:text-slate-300/g, 'text-slate-700 dark:text-slate-300');
content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-slate-600 dark:text-slate-400');

// Also check for bg compounding
content = content.replace(/bg-\[\#0939a4\]\/5 dark:bg-\[\#FBB040\]\/10/g, 'bg-[#0939a4]/5 dark:bg-[#FBB040]/10');
content = content.replace(/border-slate-100 dark:border-slate-800/g, 'border-slate-100 dark:border-slate-800');

// Let's replace the contact info placeholders I just noticed: +91 XXXXXXXXXX
content = content.replace(/\+91 XXXXXXXXXX/g, '+91 86020 27324');

// Finally, let's fix the extra closing tags if they are still messed up at the bottom
// We want <PolicyLayout> to wrap <div className="policy-content-wrapper">
// So at the end, it should be: </div></PolicyLayout>
fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed compounded classes");
