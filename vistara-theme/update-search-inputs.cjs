const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'pages', 'admin');

const walk = (dir) => {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    });
};

const processFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Use a regex to find input tags that have a placeholder containing "Search"
    const inputRegex = /<input([^>]*placeholder=["'][^"']*search[^"']*["'][^>]*)>/gi;
    
    content = content.replace(inputRegex, (match, inner) => {
        let newInner = inner;
        let innerModified = false;
        
        // Find className
        const classRegex = /className=["']([^"']*)["']/i;
        const classMatch = inner.match(classRegex);
        
        if (classMatch) {
            let classString = classMatch[1];
            
            // Replace py-2, py-2.5, py-3 with py-1.5
            if (/py-(2|2\.5|3|4)\b/.test(classString)) {
                classString = classString.replace(/py-(2|2\.5|3|4)\b/g, 'py-1.5');
                innerModified = true;
            }
            // Add py-1.5 if missing (and no py- is present)
            if (!/py-/.test(classString)) {
                classString += ' py-1.5';
                innerModified = true;
            }

            // Replace text sizing with text-[9px]
            if (/text-(xs|sm|base|lg|xl|\[1[0-9]px\])\b/.test(classString)) {
                classString = classString.replace(/text-(xs|sm|base|lg|xl|\[1[0-9]px\])\b/g, 'text-[9px]');
                innerModified = true;
            }
            
            // Replace h-10, h-12 with nothing to let py handle height
            if (/h-(10|12|14|16)\b/.test(classString)) {
                classString = classString.replace(/h-(10|12|14|16)\b/g, '');
                innerModified = true;
            }

            if (innerModified) {
                newInner = newInner.replace(classMatch[0], `className="${classString.trim()}"`);
            }
        }
        
        if (innerModified) {
            modified = true;
            return `<input${newInner}>`;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated search inputs in: ${filePath.replace(targetDir, '')}`);
    }
};

walk(targetDir);
console.log('Done!');
