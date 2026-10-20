const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const files = fs.readdirSync(localesDir);

for (const file of files) {
  if (file.endsWith('.json')) {
    const fullPath = path.join(localesDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace brandName and brandHighlight
    content = content.replace(/"brandName":\s*"[^"]+"/, '"brandName": "DO"');
    content = content.replace(/"brandHighlight":\s*"[^"]+"/, '"brandHighlight": "BEHA"');
    
    // Replace any remaining Dokkany with DOBEHA
    content = content.replace(/Dokkany/gi, 'DOBEHA');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated', file);
  }
}
