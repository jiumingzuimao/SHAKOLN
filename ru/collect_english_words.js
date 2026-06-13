const fs = require('fs');
const path = require('path');

// 读取当前文件
const dataPath = path.join(__dirname, 'product-data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// 收集所有英文词汇
const englishWords = new Set();

function collectEnglish(str) {
    const matches = str.match(/[a-zA-Z]+/g);
    if (matches) {
        matches.forEach(word => {
            if (word.length > 1) { // 过滤掉单个字母
                englishWords.add(word);
            }
        });
    }
}

data.products.forEach(product => {
    collectEnglish(product.name);
    collectEnglish(product.description);
    collectEnglish(product.category);
});

console.log('=== 剩余英文词汇 ===');
console.log([...englishWords].sort());
console.log(`\n总共 ${englishWords.size} 个英文词汇`);
