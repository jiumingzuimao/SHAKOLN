const fs = require('fs');
const path = require('path');

// 读取当前文件
const dataPath = path.join(__dirname, 'product-data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// 收集所有英文词汇
const englishWords = new Set();
const examples = [];

function collectEnglish(str, product) {
    const matches = str.match(/[a-zA-Z]+/g);
    if (matches) {
        matches.forEach(word => {
            if (word.length > 1) {
                englishWords.add(word);
                if (examples.length < 20 && !examples.find(e => e.word === word)) {
                    examples.push({ word, product: product.id, name: product.name });
                }
            }
        });
    }
}

data.products.forEach(product => {
    collectEnglish(product.name, product);
    collectEnglish(product.description, product);
    collectEnglish(product.category, product);
});

console.log('=== 剩余英文词汇统计 ===');
console.log(`总共还有 ${englishWords.size} 个英文词汇`);
console.log('\n词汇列表（前100个）:');
const sortedWords = [...englishWords].sort();
sortedWords.slice(0, 100).forEach(word => {
    const example = examples.find(e => e.word === word);
    console.log(`- ${word}${example ? ` (示例: 产品 ${example.product} - ${example.name})` : ''}`);
});
if (sortedWords.length > 100) {
    console.log(`...还有 ${sortedWords.length - 100} 个词汇`);
}

console.log('\n=== 验证几个产品的翻译 ===');
const sampleProducts = [28, 31, 34, 35, 38, 41, 43, 48, 49, 50];
sampleProducts.forEach(id => {
    const product = data.products.find(p => p.id === id);
    if (product) {
        console.log(`\n产品 ${id}:`);
        console.log(`  名称: ${product.name}`);
        console.log(`  描述: ${product.description}`);
        console.log(`  分类: ${product.category}`);
    }
});
