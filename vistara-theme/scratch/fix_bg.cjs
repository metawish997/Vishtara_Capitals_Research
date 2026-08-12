const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/pages/policies');

const replacements = [
    { regex: /bg-slate-50 dark:bg-slate-800\/50 border border-slate-200 dark:border-slate-700\/50 rounded p-[0-9]+/g, replace: '' },
    { regex: /bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800/g, replace: 'border-b border-slate-100 dark:border-slate-800' },
    { regex: /bg-slate-50 dark:bg-slate-800/g, replace: '' },
    { regex: /bg-white dark:bg-slate-800/g, replace: 'bg-transparent dark:bg-transparent' }, // for inputs
    { regex: /rounded border border-slate-200 dark:border-slate-700 p-5/g, replace: '' },
    { regex: /border border-slate-200 dark:border-slate-700 rounded p-[0-9]+/g, replace: '' }
];

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        replacements.forEach(r => {
            content = content.replace(r.regex, r.replace);
        });
        
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
console.log("Done fixing backgrounds");
