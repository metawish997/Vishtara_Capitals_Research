const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/pages/policies');

const replacements = [
    { regex: /namita\.namitarathore@gmail\.com/gi, replace: 'chouhananujay@gmail.com' },
    { regex: /9457296893/g, replace: '8602027324' },
    { regex: /\+91\s*8602027324/g, replace: '+91 86020 27324' },
    { regex: /NAMITA\s+RATHORE\s+PROPRIETOR\s+OF/gi, replace: 'ANUJAY CHOUHAN PROPRIETOR OF' },
    { regex: /Namita\s+Rathore/gi, replace: 'Anujay Chouhan' },
    { regex: /H\.no\.\s*223\s*Qila\s*Chawni,\s*near\s*Holi\s*Chowk,\s*Ward\s*No\.\s*47,\s*Rampur\s*Road,\s*Bareilly,\s*Uttar\s*Pradesh-?243001/gi, replace: 'C-20/1, Mahananda Nagar, Ujjain (M.P.), India' },
    { regex: /223\s*Qila\s*Chawni,\s*near\s*Holi\s*Chowk,\s*Ward\s*No\.\s*47,\s*Rampur\s*Road,\s*Bareilly,\s*UP-?243001/gi, replace: 'C-20/1, Mahananda Nagar, Ujjain (M.P.), India' },
    { regex: /223\s*Qila\s*Chawni,\s*near\s*Holi\s*Chowk,\s*Ward\s*No\.\s*47,\s*Rampur\s*Road,\s*Bareilly,\s*Uttar\s*Pradesh-?243001/gi, replace: 'C-20/1, Mahananda Nagar, Ujjain (M.P.), India' },
    { regex: /House\s*No\s*223,\s*Oila\s*Chawni\s*Near\s*Holi\s*Chowk\s*Ward\s*No\s*47,\s*Rampur\s*Road,\s*Bareilly,\s*Uttar\s*Pradesh,?\s*243001/gi, replace: 'C-20/1, Mahananda Nagar, Ujjain (M.P.), India' },
    { regex: /Page\s+\d+\s+of\s+\d+/gi, replace: '' },
    { regex: /<div[^>]*>[\s\n]*<\/div>/g, replace: '' }, // cleanup empty divs left by page removal
    { regex: /<br\/>\s*<br\/>\s*<\/p>/g, replace: '</p>' } // cleanup empty brs before closing p
];

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove the specific absolute page div
        content = content.replace(/<div className="absolute bottom-6 right-6 text-sm font-semibold text-slate-600">\s*Page \d+ of \d+\s*<\/div>/g, '');
        
        replacements.forEach(r => {
            content = content.replace(r.regex, r.replace);
        });

        // Some manual address fixes if regex missed them due to newlines
        content = content.replace(/223 Qila Chawni.*?243001/gs, 'C-20/1, Mahananda Nagar, Ujjain (M.P.), India');
        
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
console.log("Done replacing");
