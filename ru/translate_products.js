const fs = require('fs');
const path = require('path');

// 读取原始JSON文件
const dataPath = path.join(__dirname, 'product-data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// 专业俄文汽车零部件翻译映射表
const translationMap = {
    // 基础零部件
    'Oil': 'Масляный',
    'Cooler': 'охладитель',
    'Pipe': 'труба',
    'Seal': 'уплотнение',
    'Gasket': 'прокладка',
    'Ring': 'кольцо',
    'Fuel': 'топливный',
    'Injector': 'форсунка',
    'Lower': 'нижнее',
    'Upper': 'верхнее',
    'High': 'высокое',
    'Pressure': 'давление',
    'Pump': 'насос',
    'Water': 'водяной',
    'Separator': 'сепаратор',
    'Camshaft': 'распределительный вал',
    'Solenoid': 'соленоид',
    'Valve': 'клапан',
    'Turbo': 'турбокомпрессор',
    'Turbocharger': 'турбокомпрессор',
    'EGR': 'EGR',
    'Return': 'возвратный',
    'Dipstick': 'щуп',
    'Port': 'порт',
    'Exhaust': 'выхлопной',
    'System': 'система',
    'Body': 'кузов',
    'Thermostat': 'термостат',
    
    // 常见组合
    'Oil Cooler': 'масляный охладитель',
    'Oil Return Pipe': 'труба возврата масла',
    'Fuel Injector': 'топливная форсунка',
    'High Pressure Pump': 'насос высокого давления',
    'Oil Water Separator': 'сепаратор масла и воды',
    'Camshaft Solenoid Valve': 'соленоидный клапан распределительного вала',
    'EGR Pipe': 'труба EGR',
    'Oil Dipstick': 'щуп уровня масла',
    'Exhaust System': 'система выхлопа',
    'Port Gasket': 'прокладка порта',
    
    // 完整产品名称
    'Oil Cooler Pipe Seal': 'Уплотнительное кольцо трубы масляного охладителя',
    'Fuel Injector Seal Lower': 'Нижнее уплотнительное кольцо топливной форсунки',
    'Fuel Injector Seal Upper': 'Верхнее уплотнительное кольцо топливной форсунки',
};

// 检测是否包含英文字母
function containsEnglish(str) {
    return /[a-zA-Z]/.test(str);
}

// 翻译文本函数
function translateText(text) {
    let translated = text;
    
    // 首先尝试完整匹配
    for (const [english, russian] of Object.entries(translationMap)) {
        if (translated.includes(english)) {
            translated = translated.replace(new RegExp(english, 'g'), russian);
        }
    }
    
    // 然后尝试单个单词匹配
    const words = translated.match(/[a-zA-Z]+/g) || [];
    for (const word of words) {
        if (translationMap[word]) {
            translated = translated.replace(new RegExp(word, 'g'), translationMap[word]);
        }
    }
    
    return translated;
}

// 记录修改的产品
const modifiedProducts = [];

// 处理每个产品
data.products.forEach(product => {
    let modified = false;
    
    // 处理产品名称
    if (containsEnglish(product.name)) {
        const oldName = product.name;
        product.name = translateText(product.name);
        if (oldName !== product.name) {
            modified = true;
        }
    }
    
    // 处理描述
    if (containsEnglish(product.description)) {
        const oldDesc = product.description;
        product.description = translateText(product.description);
        if (oldDesc !== product.description) {
            modified = true;
        }
    }
    
    // 处理分类
    if (containsEnglish(product.category)) {
        const oldCategory = product.category;
        product.category = translateText(product.category);
        if (oldCategory !== product.category) {
            modified = true;
        }
    }
    
    if (modified) {
        modifiedProducts.push({
            id: product.id,
            code: product.code,
            name: product.name
        });
    }
});

// 保存修改后的文件
const outputPath = path.join(__dirname, 'product-data.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

console.log('=== 翻译完成 ===');
console.log(`总共修改了 ${modifiedProducts.length} 个产品`);
console.log('\n修改的产品列表:');
modifiedProducts.forEach(p => {
    console.log(`ID: ${p.id}, 代码: ${p.code}, 名称: ${p.name}`);
});
console.log('\n文件已保存到: ' + outputPath);
