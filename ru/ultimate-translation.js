const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'product-data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// 完整的专业汽车零部件俄文翻译映射表
const translationMap = {
    // 标准汽车术语（保留国际通用缩写）
    'ABS': 'ABS',
    'EGR': 'EGR',
    'CV': 'CV',
    'LED': 'LED',
    'DPK': 'DPK',
    'DRL': 'DRL',
    'PK': 'PK',
    'WD': 'WD',
    '4WD': '4WD',
    
    // 颜色和特征
    'Xenon': 'Ксенон',
    'Black': 'Чёрный',
    'Mocha': 'Мокко',
    'Sport': 'Спорт',
    
    // 汽车零部件术语
    'Damper': 'Демпфер',
    'Dashboard': 'Приборная панель',
    'Distribution': 'Распределительный',
    'Domestic': 'Домашний',
    'Double': 'Двойной',
    'Meter': 'Метр',
    'Middle': 'Средний',
    'Model': 'Модель',
    'Mount': 'Подушка',
    'MountL': 'ПодушкаЛ',
    'MountR': 'ПодушкаП',
    'Mounting': 'Монтаж',
    'New': 'Новый',
    'No': 'Нет',
    'Normal': 'Нормальный',
    'Old': 'Старый',
    'Operation': 'Операция',
    'Optimal': 'Оптимальный',
    'Out': 'Выход',
    'Outside': 'Внешний',
    'Oxygen': 'Кислородный',
    'Pair': 'Пара',
    'Path': 'Путь',
    'Performance': 'Производительность',
    'Positive': 'Положительный',
    'Pre': 'Пре',
    'Precise': 'Точный',
    'Premium': 'Премиум',
    'Purge': 'Очистка',
    'Quality': 'Качество',
    'Reinforced': 'Усиленный',
    'Radar': 'Радар',
    'Recirculation': 'Рекиркуляция',
    'Reliable': 'Надёжный',
    'Resistant': 'Устойчивый',
    'Resistor': 'Резистор',
    'Resonator': 'Резонатор',
    'Responsive': 'Отзывчивый',
    'Rigorously': 'Строго',
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
    'Tooth': 'Зуб',
    'Tow': 'Буксировка',
    'Transformer': 'Трансформатор',
    'Vehicle': 'Транспортное средство',
    'Wiper': 'Щетка стеклоочистителя',
    'Blade': 'Лезвие',
    'Cut': 'Разрез',
    
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
    'Headlight Washer Hose': 'Шланг омывателя фар',
    'Anti-theft Screw': 'Антикрабный винт',
    'Belt Tensioner': 'Натяжитель ремня',
    'Pretensioner': 'Преднатяжитель',
    'Crankshaft Pulley': 'Шкив коленвала',
    'Water Pump with Switch': 'Водяной насос с переключателем',
    'Front and Rear Wheel Bearing': 'Передний и задний подшипник колеса',
    'Tailgate': 'Задняя дверь',
    'Switchable': 'Переключаемый',
    'Module with Single Motor': 'Модуль с одиночным мотором',
    'AC Pipe Low Pressure Pipe to Compressor': 'Труба кондиционера низкого давления к компрессору',
    
    // 处理被分割的单词
    'able': '',
    'and': 'и',
    'er': '',
    'ey': '',
    'for': 'для',
    'gate': '',
    'gla': '',
    'ing': '',
    'light': 'свет',
    'ng': '',
    'priming': '',
    'rest': '',
    'roof': '',
    'shade': '',
    'tector': '',
    'tensioner': 'натяжитель',
    'theft': '',
    'to': 'к',
    'with': 'с',
    'al': '',
    'cm': '',
    'ed': '',
    'el': '',
    'Year': 'Год',
    'forBMW': 'для BMW',
    'forBMWE': 'для BMW E',
    'forBMWN': 'для BMW N',
    'erL': '',
    'erR': '',
    'tensionerL': 'натяжительЛ',
    'tensionerR': 'натяжительП'
};

// 特殊修复模式
function fixBrokenWords(text) {
    if (!text) return text;
    
    let fixed = text;
    
    // 修复被错误分割的单词
    fixed = fixed.replace(/Переключательable/g, 'Переключаемый');
    fixed = fixed.replace(/Тянутьey/g, 'Шкив');
    fixed = fixed.replace(/Передний and Задний/g, 'Передний и задний');
    fixed = fixed.replace(/Натяжениеer/g, 'Натяжитель');
    fixed = fixed.replace(/Головкаlight/g, 'Фара');
    fixed = fixed.replace(/Хвостgate/g, 'Задняя дверь');
    fixed = fixed.replace(/Пре-tensioner/g, 'Преднатяжитель');
    fixed = fixed.replace(/Анти-theft/g, 'Антикрабный');
    fixed = fixed.replace(/Труба toКомпрессор/g, 'Труба к компрессору');
    fixed = fixed.replace(/Модуль with/g, 'Модуль с');
    fixed = fixed.replace(/Масло Крышка/g, 'Крышка масляного фильтра');
    fixed = fixed.replace(/with Одиночный/g, 'с одиночным');
    fixed = fixed.replace(/Коленчатый вал Тянутьey/g, 'Шкив коленвала');
    
    return fixed;
}

// 按长度降序排序，确保长短语优先匹配
const sortedEntries = Object.entries(translationMap).sort((a, b) => b[0].length - a[0].length);

function translateText(text) {
    if (!text) return text;
    
    let translated = text;
    
    // 1. 首先修复被错误分割的单词
    translated = fixBrokenWords(translated);
    
    // 2. 在俄文和英文之间添加空格
    translated = translated.replace(/([а-яА-Я])([A-Z])/g, '$1 $2');
    translated = translated.replace(/([A-Z])([а-яА-Я])/g, '$1 $2');
    
    // 3. 处理完整短语匹配
    for (const [english, russian] of sortedEntries) {
        if (english && translated.includes(english)) {
            const regex = new RegExp(english.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            if (russian) {
                translated = translated.replace(regex, russian);
            } else {
                // 如果翻译为空，直接删除该词
                translated = translated.replace(regex, '');
            }
        }
    }
    
    // 4. 清理多余的空格
    translated = translated.replace(/\s+/g, ' ').trim();
    
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

console.log('=== 最终翻译完成 ===');
console.log(`翻译产品名称: ${translatedNames}`);
console.log(`翻译产品描述: ${translatedDescriptions}`);
console.log(`翻译产品分类: ${translatedCategories}`);
console.log('文件已保存到 product-data.json');
