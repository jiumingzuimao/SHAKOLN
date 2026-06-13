const fs = require('fs');
const path = require('path');

// 读取原始备份文件
const dataPath = path.join(__dirname, 'product-data.json.backup');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// 专业俄文汽车零部件翻译映射表（改进版）
const translationMap = {
    // 完整产品名称优先
    'Oil Cooler Pipe Seal': 'Уплотнительное кольцо трубы масляного охладителя',
    'Fuel Injector Seal Lower': 'Нижнее уплотнительное кольцо топливной форсунки',
    'Fuel Injector Seal Upper': 'Верхнее уплотнительное кольцо топливной форсунки',
    'Oil Return Pipe': 'Труба возврата масла',
    'High Pressure Pump': 'Насос высокого давления',
    'Oil Water Separator': 'Сепаратор масла и воды',
    'Camshaft Solenoid Valve': 'Соленоидный клапан распределительного вала',
    'EGR Pipe': 'Труба EGR',
    'Oil Dipstick': 'Щуп уровня масла',
    'Exhaust System': 'Система выхлопа',
    'Port Gasket': 'Прокладка порта',
    'Power Steering': 'Гидроусилитель руля',
    'Expansion Tank': 'Расширительный бачок',
    'Handbrake Switch': 'Переключатель ручного тормоза',
    'Combination Switch': 'Комбинированный переключатель',
    'Trunk Switch': 'Переключатель багажника',
    'Front Wheel Bearing': 'Подшипник переднего колеса',
    'Window Switch': 'Переключатель стеклоподъемника',
    'Air Pump': 'Воздушный насос',
    'Left Front Window Switch': 'Переключатель левого переднего стеклоподъемника',
    'Fuel Hose': 'Топливный шланг',
    'Coolant Return Pipe': 'Труба возврата охлаждающей жидкости',
    'Transmission Cooler Pipe': 'Труба охладителя коробки передач',
    'Turbocharger Pipe': 'Труба турбокомпрессора',
    'Intake Pipe': 'Впускная труба',
    'Intercooler Pipe': 'Труба интеркулера',
    'Front Boot': 'Пыльник передний',
    'Rear Boot': 'Пыльник задний',
    'Pressure Sensor': 'Датчик давления',
    'AC Pipe': 'Труба кондиционера',
    'Emission Pipe': 'Труба системы выпуска',
    'Carbon Canister Valve': 'Клапан адсорбера',
    'Electric Fan': 'Электровентилятор',
    'Front Bump Stop': 'Отбойник передний',
    'Rear Bump Stop': 'Отбойник задний',
    'Carbon Canister': 'Адсорбер',
    'EGR Valve': 'Клапан EGR',
    'Vent Valve': 'Вентиляционный клапан',
    'Exhaust Unit': 'Блок выхлопной системы',
    'Heater Valve': 'Клапан отопителя',
    'Auxiliary Water Pump': 'Вспомогательный водяной насос',
    'Camshaft Position Sensor': 'Датчик положения распределительного вала',
    'Oil Pressure Sensor': 'Датчик давления масла',
    'ABS Sensor': 'Датчик ABS',
    'Height Sensor': 'Датчик высоты',
    'Intake Pressure Sensor': 'Датчик давления во впускном коллекторе',
    'Washer Reservoir': 'Бачок омывателя',
    'Transmission Oil Pan': 'Поддон масляный коробки передач',
    'ABS Wire': 'Провод датчика ABS',
    'Eccentric Shaft Sensor': 'Датчик эксцентрикового вала',
    
    // 组合词翻译
    'Upper Water Hose': 'Верхний водяной шланг',
    'Lower Water Hose': 'Нижний водяной шланг',
    'Small Water Hose': 'Маленький водяной шланг',
    'Water Hose': 'Водяной шланг',
    'Expansion Tank Water Hose': 'Шланг расширительного бачка',
    'Expansion Tank Return Water Hose': 'Возвратный шланг расширительного бачка',
    
    // 单个词汇（按优先级排序）
    'Upper': 'Верхний',
    'Lower': 'Нижний',
    'Small': 'Маленький',
    'Oil': 'Масляный',
    'Cooler': 'Охладитель',
    'Pipe': 'Труба',
    'Seal': 'Уплотнение',
    'Gasket': 'Прокладка',
    'Ring': 'Кольцо',
    'Fuel': 'Топливный',
    'Injector': 'Форсунка',
    'High': 'Высокое',
    'Pressure': 'Давление',
    'Pump': 'Насос',
    'Water': 'Водяной',
    'Separator': 'Сепаратор',
    'Camshaft': 'Распределительный вал',
    'Solenoid': 'Соленоид',
    'Valve': 'Клапан',
    'Turbo': 'Турбокомпрессор',
    'Turbocharger': 'Турбокомпрессор',
    'EGR': 'EGR',
    'Return': 'Возвратный',
    'Dipstick': 'Щуп',
    'Port': 'Порт',
    'Exhaust': 'Выхлопной',
    'System': 'Система',
    'Body': 'Кузов',
    'Thermostat': 'Термостат',
    'Power': 'Гидро',
    'Steering': 'Усилитель руля',
    'Hose': 'Шланг',
    'Expansion': 'Расширительный',
    'Tank': 'Бачок',
    'Handbrake': 'Ручной тормоз',
    'Switch': 'Переключатель',
    'Combination': 'Комбинированный',
    'Trunk': 'Багажник',
    'Front': 'Передний',
    'Wheel': 'Колесо',
    'Bearing': 'Подшипник',
    'Window': 'Стеклоподъемник',
    'Silver': 'Серебристый',
    'Black': 'Черный',
    'Air': 'Воздушный',
    'Left': 'Левый',
    'Right': 'Правый',
    'Improved': 'Улучшенный',
    'Steel': 'Стальной',
    'Multiple': 'Множественные',
    'Ratio': 'Соотношение',
    'Coolant': 'Охлаждающая жидкость',
    'Transmission': 'Коробка передач',
    'Inlet': 'Впускной',
    'Intercooler': 'Интеркулер',
    'Boot': 'Пыльник',
    'Sensor': 'Датчик',
    'AC': 'Кондиционер',
    'Condenser': 'Конденсатор',
    'Evaporator': 'Испаритель',
    'Compressor': 'Компрессор',
    'Emission': 'Выпуск',
    'Carbon': 'Углеродный',
    'Canister': 'Адсорбер',
    'Electric': 'Электрический',
    'Fan': 'Вентилятор',
    'With': 'С',
    'Without': 'Без',
    'Air Reservoir': 'Воздушный ресивер',
    'Vent': 'Вентиляционный',
    'Unit': 'Блок',
    'Heater': 'Отопитель',
    'Auxiliary': 'Вспомогательный',
    'Position': 'Положение',
    'ABS': 'ABS',
    'Height': 'Высота',
    'Intake': 'Впускной',
    'Washer': 'Омыватель',
    'Reservoir': 'Бачок',
    'Single': 'Одиночный',
    'Hole': 'Отверстие',
    'Heating': 'Подогрев',
    'Original': 'Оригинал',
    'Not': 'Не',
    'Sold': 'Продается',
    'Separately': 'Отдельно',
    'ATM': 'АТМ',
    'Emergency': 'Аварийный',
    'Battery': 'Аккумулятор',
    'Low': 'Низкий',
    'Rear': 'Задний',
    'Wire': 'Провод',
    'Eccentric': 'Эксцентриковый',
    'Shaft': 'Вал',
    'Dipstick': 'Щуп',
    'Heavy': 'Тяжелый',
    'High': 'Высокий',
    'Valve': 'Клапан',
    'Gasket': 'Прокладка',
    'Single': 'Одиночный',
};

// 检测是否包含英文字母
function containsEnglish(str) {
    return /[a-zA-Z]/.test(str);
}

// 翻译文本函数（改进版）
function translateText(text) {
    let translated = text;
    
    // 1. 首先尝试完整匹配（最长的优先）
    const sortedEntries = Object.entries(translationMap).sort((a, b) => b[0].length - a[0].length);
    
    for (const [english, russian] of sortedEntries) {
        // 使用单词边界进行更精确的匹配
        const regex = new RegExp('\\b' + english.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'g');
        if (regex.test(translated)) {
            translated = translated.replace(regex, russian);
        }
    }
    
    // 2. 处理一些常见的拼接情况
    translated = translated.replace(/UpperWater/g, 'Верхний водяной');
    translated = translated.replace(/LowerWater/g, 'Нижний водяной');
    translated = translated.replace(/SmallWater/g, 'Маленький водяной');
    translated = translated.replace(/UpperВодяной/g, 'Верхний водяной');
    translated = translated.replace(/LowerВодяной/g, 'Нижний водяной');
    translated = translated.replace(/SmallВодяной/g, 'Маленький водяной');
    translated = translated.replace(/Водянойшланг/g, 'Водяной шланг');
    translated = translated.replace(/ВерхнееВодяной/g, 'Верхний водяной');
    translated = translated.replace(/НижнееВодяной/g, 'Нижний водяной');
    translated = translated.replace(/SmallВодяной/g, 'Маленький водяной');
    
    // 3. 处理剩余的英文单词
    const remainingWords = translated.match(/[a-zA-Z]+/g) || [];
    for (const word of remainingWords) {
        if (translationMap[word]) {
            translated = translated.replace(new RegExp('\\b' + word + '\\b', 'g'), translationMap[word]);
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

console.log('=== 翻译完成（改进版）===');
console.log(`总共修改了 ${modifiedProducts.length} 个产品`);
console.log('\n修改的产品列表（前50个）:');
modifiedProducts.slice(0, 50).forEach(p => {
    console.log(`ID: ${p.id}, 代码: ${p.code}, 名称: ${p.name}`);
});
if (modifiedProducts.length > 50) {
    console.log(`...还有 ${modifiedProducts.length - 50} 个产品`);
}
console.log('\n文件已保存到: ' + outputPath);
