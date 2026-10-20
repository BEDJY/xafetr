const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/data/mockUsers.ts',
  'src/pages/legal/TermsPage.tsx',
  'src/pages/support/ApiPage.tsx',
  'src/pages/support/DocsPage.tsx',
  'README.md'
];

for (const rel of filesToUpdate) {
  const p = path.join(__dirname, '..', rel);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/dokkany\.dev/g, 'dobeha.dev');
    content = content.replace(/dokkany\.test/g, 'dobeha.test');
    content = content.replace(/Dokkany/g, 'DOBEHA');
    content = content.replace(/dokkany/g, 'dobeha');
    fs.writeFileSync(p, content, 'utf8');
    console.log('Replaced Dokkany in', rel);
  }
}
