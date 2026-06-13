const fs = require('fs');
const path = require('path');

// 创建备份文件（如果还没有的话）
const dataPath = path.join(__dirname, 'product-data.json');
const backupPath = path.join(__dirname, 'product-data.json.backup');

if (!fs.existsSync(backupPath)) {
    console.log('创建备份文件...');
    fs.copyFileSync(dataPath, backupPath);
}

const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// 专业汽车零部件俄文翻译映射表
const translationMap = {
    // 汽车系统术语
    'ABS': 'ABS',
    'EGR': 'EGR',
    'CV': 'CV',
    'LED': 'LED',
    'Xenon': 'Ксенон',
    'Black': 'Чёрный',
    'Mocha': 'Мокко',
    'Sport': 'Спорт',
    'Damper': 'Демпфер',
    'Dashboard': 'Приборная панель',
    'Distribution': 'Распределительный',
    'Domestic': 'Домашний',
    'Double': 'Двойной',
    'EU': 'ЕС',
    'HL': 'HL',
    'LR': 'LR',
    'Meter': 'Метр',
    'Middle': 'Средний',
    'Model': 'Модель',
    'Mount': 'Подушка',
    'MountL': 'ПодушкаЛ',
    'MountR': 'ПодушкаП',
    'Mounting': 'Монтаж',
    'Mouse': 'Мышь',
    'New': 'Новый',
    'No': 'Нет',
    'Normal': 'Нормальный',
    'Old': 'Старый',
    'Operation': 'Операция',
    'Optimal': 'Оптимальный',
    'Out': 'Выход',
    'Outside': 'Внешний',
    'Oxygen': 'Кислородный',
    'PK': 'PK',
    'Pair': 'Пара',
    'Path': 'Путь',
    'Performance': 'Производительность',
    'Positive': 'Положительный',
    'Pre': 'Пре',
    'Precise': 'Точный',
    'Premium': 'Премиум',
    'Purge': 'Очистка',
    'Quality': 'Качество',
    'RReinforced': 'Усиленный',
    'Radar': 'Радар',
    'Recirculation': 'Рекиркуляция',
    'Reliable': 'Надёжный',
    'Resistant': 'Устойчивый',
    'Resistor': 'Резистор',
    'Resonator': 'Резонатор',
    'Responsive': 'Отзывчивый',
    'Rigorously': 'Строго',
    'SM': 'SM',
    'SXenon': 'Ксенон',
    'Screen': 'Экран',
    'Self': 'Самостоятельный',
    'Sensitive': 'Чувствительный',
    'Servo': 'Сервопривод',
    'Shape': 'Форма',
    'Shutter': 'Затвор',
    'Silk': 'Шелк',
    'Size': 'Размер',
    'Smart': 'Смарт',
    'Smooth': 'Гладкий',
    'Source': 'Источник',
    'Spec': 'Спецификация',
    'Special': 'Специальный',
    'Spray': 'Спрей',
    'Square': 'Квадратный',
    'Stable': 'Стабильный',
    'Structure': 'Структура',
    'Strut': 'Стойка',
    'StrutL': 'СтойкаЛ',
    'StrutR': 'СтойкаП',
    'Subframe': 'Субрама',
    'Suction': 'Всасывающий',
    'Suitable': 'Подходящий',
    'Supply': 'Подача',
    'Sway': 'Поперечный',
    'To': 'К',
    'Tooth': 'Зуб',
    'Tow': 'Буксировка',
    'Transformer': 'Трансформатор',
    'Vehicle': 'Транспортное средство',
    'WD': 'WD',
    'WFacelift': 'Рефреш',
    'Wiper': 'Щетка стеклоочистителя',
    'XB': 'XB',
    'AB': 'AB',
    'AL': 'AL',
    'BD': 'BD',
    'Blade': 'Лезвие',
    'CLA': 'CLA',
    'Cut': 'Разрез',
    'DF': 'DF',
    'DJ': 'DJ',
    'DPK': 'DPK',
    'DRL': 'DRL',
    
    // 完整短语翻译
    'Door Handle Black': 'Ручка двери чёрная',
    'Steering Damper': 'Рулевой демпфер',
    'Outside Temperature Sensor': 'Внешний датчик температуры',
    'Front Strut Mount': 'Передняя подушка стойки',
    'Front Strut MountL/R': 'Передняя подушка стойки Л/П',
    'Strut Mount': 'Подушка стойки',
    'Tailgate Electric StrutR': 'Электрическая стойка задней двери П',
    'Trunk StrutL': 'Стойка багажника Л',
    'EGR Pipe Seal': 'Уплотнительное кольцо трубы EGR',
    'Purge Pipe': 'Труба очистки',
    'Oil Suction Pipe': 'Всасывающая труба масла',
    'Coolant Hose Supply Line': 'Шланг охлаждающей жидкости подача',
    'Exhaust Pipe Path': 'Путь выхлопной трубы',
    
    // 品牌名称保留
    'SHAKOLN': 'SHAKOLN',
    'SHAKOLNBMW': 'SHAKOLN BMW',
    'BMW': 'BMW',
    'Mercedes-Benz': 'Мерседес-Бенц'
};

// 按长度降序排序，确保长短语优先匹配
const sortedEntries = Object.entries(translationMap).sort((a, b) => b[0].length - a[0].length);

function translateText(text) {
    if (!text) return text;
    
    let translated = text;
    
    // 1. 首先在俄文和英文之间添加空格（例如 "ВерхнееВодяной" → "Верхнее Водяной"）
    translated = translated.replace(/([а-яА-Я])([A-Z])/g, '$1 $2');
    translated = translated.replace(/([A-Z])([а-яА-Я])/g, '$1 $2');
    
    // 2. 处理完整短语匹配（按长度降序）
    for (const [english, russian] of sortedEntries) {
        if (translated.includes(english)) {
            const regex = new RegExp(english.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            translated = translated.replace(regex, russian);
        }
    }
    
    // 3. 处理单个单词
    const words = translated.match(/[a-zA-Z]+/g) || [];
    for (const word of words) {
        if (translationMap[word]) {
            const regex = new RegExp(word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            translated = translated.replace(regex, translationMap[word]);
        }
    }
    
    return translated;
}

// 翻译统计
let translatedNames = 0;
let translatedDescriptions = 0;
let translatedCategories = 0;

// 处理所有产品
data.products.forEach(product => {
    const originalName = product.name;
    product.name = translateText(product.name);
    if (product.name !== originalName) translatedNames++;
    
    const originalDesc = product.description;
    product.description = translateText(product.description);
    if (product.description !== originalDesc) translatedDescriptions++;
    
    const originalCat = product.category;
    product.category = translateText(product.category);
    if (product.category !== originalCat) translatedCategories++;
});

// 保存修改后的文件
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log('=== 翻译完成 ===');
console.log(`翻译产品名称: ${translatedNames}`);
console.log(`翻译产品描述: ${translatedDescriptions}`);
console.log(`翻译产品分类: ${translatedCategories}`);
console.log('文件已保存到 product-data.json');
console.log('备份文件已保存到 product-data.json.backup');
