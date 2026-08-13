// Read prompt content:
import fs from 'fs';
const content = fs.readFileSync('./prompt_clean.txt', 'utf8');
console.log(content);
