const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\RAMY\\Desktop\\logo\\4fae693a-f5cf-4c28-b19e-8ceef5c79ea6.jpg';
const dest = path.join(__dirname, '..', 'public', 'logo.jpg');

fs.copyFileSync(src, dest);
console.log('Logo copied successfully to public/logo.jpg');
