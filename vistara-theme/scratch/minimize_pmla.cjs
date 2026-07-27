const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/policies/PmlaPolicy.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove outer wrappers
content = content.replace(/<div className="py-8 bg-\[\#F8FAFC\] min-h-screen">\s*<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">/, '');
// Also remove the two closing divs at the end of the file before </div>\n    </PolicyLayout>
content = content.replace(/<\/div>\s*<\/div>\s*(<\/div>\s*<\/PolicyLayout>)/, '$1');

// Remove page headers
content = content.replace(/<div className="mb-8">\s*<div className="text-base text-slate-700 mb-4 pb-2 border-b border-slate-200">\s*<p className="font-medium">.*?<\/p>\s*<\/div>/g, '<div className="mb-8 scroll-mt-28">');
content = content.replace(/<div className="text-base text-slate-700 mb-4 pb-2 border-b border-slate-200">\s*<p className="font-medium">.*?<\/p>\s*<\/div>/gs, '');

// Convert headings and text sizes
content = content.replace(/text-lg/g, 'text-[15px]');
content = content.replace(/text-xl/g, 'text-lg');
content = content.replace(/text-2xl/g, 'text-xl');
content = content.replace(/text-3xl/g, 'text-2xl');
content = content.replace(/text-4xl/g, 'text-3xl');

// Add dark mode classes
content = content.replace(/text-slate-900/g, 'text-slate-800 dark:text-slate-200');
content = content.replace(/text-slate-800/g, 'text-slate-700 dark:text-slate-300');
content = content.replace(/text-slate-700/g, 'text-slate-600 dark:text-slate-400');
content = content.replace(/text-slate-600/g, 'text-slate-500 dark:text-slate-400');
content = content.replace(/text-\[\#0939a4\]/g, 'text-[#0939a4] dark:text-[#FBB040]');
content = content.replace(/border-slate-200/g, 'border-slate-100 dark:border-slate-800');
content = content.replace(/border-slate-300/g, 'border-slate-200 dark:border-slate-700');
content = content.replace(/bg-\[\#0939a4\]\/5/g, 'bg-[#0939a4]/5 dark:bg-[#FBB040]/10');
content = content.replace(/bg-\[\#0939a4\]\/10/g, 'bg-[#0939a4]/10 dark:bg-[#FBB040]/20');
content = content.replace(/ring-\[\#0939a4\]\/20/g, 'ring-[#0939a4]/20 dark:ring-[#FBB040]/30');

// Fix duplicate dark mode classes if any (just in case)
content = content.replace(/(dark:text-slate-\d+)\s+\1/g, '$1');

// Change mb-8 to mb-8 scroll-mt-28 if not already
content = content.replace(/<div className="mb-8">/g, '<div className="mb-8 scroll-mt-28">');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Done minimizing PmlaPolicy.jsx");
