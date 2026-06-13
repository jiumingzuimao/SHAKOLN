
function getGiteeImageUrl(imgPath) {
    if (imgPath && imgPath.indexOf('baoma/') === 0) {
        return 'https://gitee.com/shakoln/baoma-img2/raw/main/' + imgPath.replace('baoma/', '');
    } else if (imgPath && imgPath.indexOf('benchi/') === 0) {
        return 'https://gitee.com/shakoln/benchi-img2/raw/master/' + imgPath.replace('benchi/', '');
    }
    return imgPath;
}

function getBasePath() {
    var path = window.location.pathname;
    if (path.indexOf('/en/') >= 0 || path.indexOf('/ru/') >= 0 || path.indexOf('/ar/') >= 0) {
        return '../';
    }
    return '';
}
// 1. Banner 轮播功能
const slides = document.querySelector('.banner-slides');
const indicators = document.querySelectorAll('.banner-indicator');
let currentIndex = 0;
const slideCount = 3;

// 自动轮播
function autoSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlide();
}

// 更新幻灯片显示
function updateSlide() {
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // 更新指示器状态
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 点击指示器切换幻灯片
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentIndex = index;
        updateSlide();
    });
});

// 启动自动轮播
setInterval(autoSlide, 5000);

// 2. 标签切换逻辑
const searchTabs = document.querySelectorAll('.search-tab');
const formWraps = document.querySelectorAll('.search-form-wrap');

searchTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // 移除所有标签的active类
        searchTabs.forEach(t => t.classList.remove('active'));
        // 给当前标签添加active类
        this.classList.add('active');
        
        // 隐藏所有表单
        formWraps.forEach(wrap => wrap.classList.remove('active'));
        // 显示对应标签的表单
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// 全局缓存和加载状态
var isCarModelsLoaded = false;
var isProductsLoaded = false;
var isHotProductsLoaded = false;

// 全局车型数据
let carModelsData = {};

// 加载车型数据
async function loadCarModelsData() {
    if (isCarModelsLoaded && carModelsData) return;
    try {
        const response = await fetch(getBasePath() + 'car-models-data.json', { cache: 'force-cache' });
        carModelsData = await response.json();
        isCarModelsLoaded = true;
    } catch (error) {
        console.error('加载车型数据失败:', error);
    }
}

// 初始化加载车型数据
loadCarModelsData();

// 3. 车系联动逻辑
function changeSeries() {
    const brand = document.getElementById('model-brand').value;
    const seriesSelect = document.getElementById('model-series');
    const typeSelect = document.getElementById('model-type');
    const yearSelect = document.getElementById('model-year');
    
    // 清空车系、车型和年款
    seriesSelect.innerHTML = '';
    typeSelect.innerHTML = '';
    yearSelect.innerHTML = '';
    
    if (brand === '') {
        seriesSelect.innerHTML = '<option value="">请先选择品牌</option>';
        typeSelect.innerHTML = '<option value="">请先选择车系</option>';
        yearSelect.innerHTML = '<option value="">请选择年款</option>';
        return;
    }
    
    // 从数据文件加载车系
    const brands = carModelsData.brands || {};
    const brandData = brands[brand];
    
    if (brandData && brandData.series) {
        let seriesHTML = '<option value="">请选择车系</option>';
        for (const [key, value] of Object.entries(brandData.series)) {
            seriesHTML += `<option value="${key}">${value.name}</option>`;
        }
        seriesSelect.innerHTML = seriesHTML;
    } else {
        // 默认车系列表
        if (brand === 'benz') {
            seriesSelect.innerHTML = `
                <option value="">请选择车系</option>
                <option value="c-class">C级</option>
                <option value="e-class">E级</option>
                <option value="s-class">S级</option>
                <option value="glc">GLC</option>
                <option value="gle">GLE</option>
                <option value="glb">GLB</option>
            `;
        } else if (brand === 'bmw') {
            seriesSelect.innerHTML = `
                <option value="">请选择车系</option>
                <option value="3-series">3系</option>
                <option value="5-series">5系</option>
                <option value="7-series">7系</option>
                <option value="x3">X3</option>
                <option value="x5">X5</option>
                <option value="x7">X7</option>
            `;
        }
    }
    
    typeSelect.innerHTML = '<option value="">请先选择车系</option>';
    yearSelect.innerHTML = '<option value="">请选择年款</option>';
}

// 4. 车型联动逻辑
document.getElementById('model-series').addEventListener('change', function() {
    const brand = document.getElementById('model-brand').value;
    const series = this.value;
    const typeSelect = document.getElementById('model-type');
    const yearSelect = document.getElementById('model-year');
    
    typeSelect.innerHTML = '';
    yearSelect.innerHTML = '';
    
    if (series === '') {
        typeSelect.innerHTML = '<option value="">请先选择车系</option>';
        yearSelect.innerHTML = '<option value="">请选择年款</option>';
        return;
    }
    
    // 从数据文件加载车型和年款
    const brands = carModelsData.brands || {};
    const brandData = brands[brand];
    
    if (brandData && brandData.series && brandData.series[series]) {
        const seriesData = brandData.series[series];
        
        // 加载车型
        let typeHTML = '<option value="">请选择车型</option>';
        if (seriesData.models) {
            for (const [key, value] of Object.entries(seriesData.models)) {
                typeHTML += `<option value="${key}">${value}</option>`;
            }
        }
        typeSelect.innerHTML = typeHTML;
        
        // 加载年款
        let yearHTML = '<option value="">请选择年款</option>';
        if (seriesData.years) {
            for (const year of seriesData.years) {
                yearHTML += `<option value="${year}">${year}</option>`;
            }
        }
        yearSelect.innerHTML = yearHTML;
    } else {
        // 默认车型列表
        typeSelect.innerHTML = `
            <option value="">请选择车型</option>
            <option value="standard">标准版</option>
            <option value="luxury">豪华版</option>
            <option value="sport">运动版</option>
        `;
        
        // 默认年款列表
        yearSelect.innerHTML = `
            <option value="">请选择年款</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
            <option value="2012">2012</option>
            <option value="2011">2011</option>
            <option value="2010">2010</option>
        `;
    }
});

// VIN解析：从VIN码中提取底盘号和车型
function parseVIN(vin) {
    const result = {
        brand: '',
        chassis: '',
        model: '',
        year: ''
    };
    
    if (!vin || vin.length !== 17) {
        return result;
    }
    
    // 根据VIN前3位识别品牌
    const wmi = vin.substring(0, 3);
    const brandCodeMap = {
        'WDD': '奔驰', 'WDC': '奔驰', 'WDB': '奔驰',
        'WBA': '宝马', 'WBX': '宝马', 'WBV': '宝马', 'WBS': '宝马', 'LBV': '宝马'
    };
    
    if (brandCodeMap[wmi]) {
        result.brand = brandCodeMap[wmi];
    }
    
    // 从VIN中提取底盘号信息（第4-7位）
    const vds = vin.substring(3, 9);
    
    // 奔驰底盘号映射（从VDS推断）
    const benzChassisMap = {
        '205': 'W205', '213': 'W213', '222': 'W222', '204': 'W204', '212': 'W212',
        '221': 'W221', '203': 'W203', '166': 'W166', '251': 'W251', '164': 'W164',
        '246': 'W246', '253': 'W253', '176': 'W176', '117': 'W117', '211': 'W211',
        '220': 'W220', '218': 'W218', '207': 'W207', '447': 'W447', '167': 'W167',
        '206': 'W206', '254': 'W254', '214': 'W214', '223': 'W223', '463': 'W463'
    };
    
    // 宝马底盘号映射（从VDS推断）
    const bmwChassisMap = {
        // F30系列（3系）
        '3A5': 'F30', '3B1': 'F30', '3B5': 'F30', '3C5': 'F30', '3D5': 'F30',
        '3E5': 'F30', '3F5': 'F30', '3G5': 'F30', '3H5': 'F30', '3J5': 'F30',
        '3K5': 'F30', '3L5': 'F30', '3M5': 'F30', '3N5': 'F30', '3P5': 'F30',
        // F18系列（5系）
        '5A5': 'F18', '5B5': 'F18', '5C5': 'F18', '5D5': 'F18', '5E5': 'F18',
        '5F5': 'F18', '5G5': 'F18', '5H5': 'F18', '5J5': 'F18', '5K5': 'F18',
        '5L5': 'F18', '5M5': 'F18', '5N5': 'F18', '5P5': 'F18', 'KY5': 'F18',
        // G38系列（5系）
        '5D2': 'G38', '5D3': 'G38', '5D4': 'G38', '5D5': 'G38', '5E2': 'G38',
        '5E3': 'G38', '5E4': 'G38', '5E5': 'G38', '5F2': 'G38', '5F3': 'G38',
        // F02系列（7系）
        'KB8': 'F02', 'KB4': 'F02', 'KB6': 'F02', 'KC8': 'F02', 'KC4': 'F02',
        // G05系列（X5）
        'M1C': 'G05', 'M2C': 'G05', 'M3C': 'G05', 'M4C': 'G05', 'M5C': 'G05',
        // G08系列（X3）
        'N1C': 'G08', 'N2C': 'G08', 'N3C': 'G08', 'N4C': 'G08', 'N5C': 'G08',
        // G01系列（X3）
        'W1C': 'G01', 'W2C': 'G01', 'W3C': 'G01', 'W4C': 'G01', 'W5C': 'G01',
        // G20系列（3系）
        '2G1': 'G20', '2G3': 'G20', '2G5': 'G20', '2G7': 'G20', '2G9': 'G20',
        // F20系列（1系）
        '1F5': 'F20', '1F7': 'F20', '1F1': 'F20', '1F3': 'F20', '1F9': 'F20',
        // G12系列（7系）
        '6B2': 'G12', '6B4': 'G12', '6B6': 'G12', '6C2': 'G12', '6C4': 'G12',
        // F49系列（X1）
        'AVJ': 'F49', 'BVJ': 'F49', 'CVJ': 'F49', 'DVJ': 'F49', 'EVJ': 'F49',
        // E84系列（X1）
        'BVL': 'E84', 'CVL': 'E84', 'DVL': 'E84', 'EVL': 'E84', 'FVL': 'E84',
        // E90系列（3系）
        'CUS': 'E90', 'DUS': 'E90', 'EUS': 'E90', 'FUS': 'E90', 'GUS': 'E90',
        // E60系列（5系）
        'EH1': 'E60', 'FH1': 'E60', 'GH1': 'E60', 'HH1': 'E60', 'JH1': 'E60',
        // E70系列（X5）
        'XZ3': 'E70', 'YZ3': 'E70', 'AZ3': 'E70', 'BZ3': 'E70', 'CZ3': 'E70',
        // F15系列（X5）
        'ZV4': 'F15', 'AV4': 'F15', 'BV4': 'F15', 'CV4': 'F15', 'DV4': 'F15',
        // F16系列（X6）
        'WY7': 'F16', 'XY7': 'F16', 'YY7': 'F16', 'AY7': 'F16', 'BY7': 'F16',
        // F25系列（X3）
        'WZ3': 'F25', 'XZ3': 'F25', 'YZ3': 'F25', 'AZ3': 'F25', 'BZ3': 'F25',
        // F52系列（1系）
        '11A': 'F52', '12A': 'F52', '11B': 'F52', '12B': 'F52', '11C': 'F52',
        // G30系列（5系）
        '5E1': 'G30', '5E3': 'G30', '5E5': 'G30', '5E7': 'G30', '5E9': 'G30',
        // G28系列（3系）
        '2G8': 'G28', '2G6': 'G28', '2G4': 'G28', '2G2': 'G28', '2H8': 'G28',
        // F35系列（3系）
        '3A8': 'F35', '3B8': 'F35', '3C8': 'F35', '3D8': 'F35', '3E8': 'F35',
        // F07系列（5系GT）
        'FH5': 'F07', 'GH5': 'F07', 'HH5': 'F07', 'JH5': 'F07', 'KH5': 'F07',
        // F26系列（X4）
        'WV5': 'F26', 'XV5': 'F26', 'YV5': 'F26', 'AV5': 'F26', 'BV5': 'F26',
        // F10系列（5系）
        '5A1': 'F10', '5B1': 'F10', '5C1': 'F10', '5D1': 'F10', '5E1': 'F10'
    };
    
    // 车型映射
    const chassisToModel = {
        'W205': 'C级', 'W213': 'E级', 'W222': 'S级', 'W204': 'C级', 'W212': 'E级',
        'W221': 'S级', 'W203': 'C级', 'W166': 'ML/GLE', 'W251': 'R级', 'W164': 'ML',
        'W246': 'B级', 'W253': 'GLC', 'W176': 'A级', 'W117': 'CLA', 'W211': 'E级',
        'W220': 'S级', 'W218': 'CLS', 'W207': 'E级Coupe', 'W447': 'V级', 'W167': 'GLE',
        'W206': 'C级', 'W254': 'C级', 'W214': 'E级', 'W223': 'S级', 'W463': 'G级',
        'F30': '3系', 'F10': '5系', 'F18': '5系', 'G05': 'X5', 'G38': '5系',
        'F35': '3系', 'F25': 'X3', 'E90': '3系', 'E60': '5系', 'F02': '7系',
        'E70': 'X5', 'F15': 'X5', 'F20': '1系', 'G12': '7系', 'G28': '3系',
        'F49': 'X1', 'E84': 'X1', 'E83': 'X3', 'F07': '5系GT', 'F16': 'X6',
        'G08': 'X3', 'G01': 'X3', 'G20': '3系', 'G30': '5系', 'F52': '1系'
    };
    
    // 尝试从VDS中提取底盘号
    if (result.brand === '奔驰') {
        // 奔驰：尝试不同的位置组合
        const candidates = [
            vds.substring(0, 3),
            vds.substring(1, 4),
            vds.substring(0, 4),
            vds.substring(1, 5)
        ];
        for (const candidate of candidates) {
            if (benzChassisMap[candidate]) {
                result.chassis = benzChassisMap[candidate];
                break;
            }
        }
    } else if (result.brand === '宝马') {
        // 宝马：尝试不同的位置组合
        const candidates = [
            vds.substring(0, 3),
            vds.substring(1, 4),
            vds.substring(2, 5),
            vds.substring(3, 6)
        ];
        for (const candidate of candidates) {
            if (bmwChassisMap[candidate]) {
                result.chassis = bmwChassisMap[candidate];
                break;
            }
        }
    }
    
    // 如果找到底盘号，推断车型
    if (result.chassis && chassisToModel[result.chassis]) {
        result.model = chassisToModel[result.chassis];
    }
    
    // 提取年份（第10位）
    const yearCode = vin.charAt(9);
    const yearMap = {
        'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014',
        'F': '2015', 'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019',
        'L': '2020', 'M': '2021', 'N': '2022', 'P': '2023', 'R': '2024',
        'S': '2025', 'T': '2026', 'V': '2027', 'W': '2028', 'X': '2029',
        'Y': '2030', '1': '2031', '2': '2032', '3': '2033', '4': '2034',
        '5': '2035', '6': '2036', '7': '2037', '8': '2038', '9': '2039'
    };
    if (yearMap[yearCode]) {
        result.year = yearMap[yearCode];
    }
    
    return result;
}

// 5. VIN查询函数
async function searchByVIN() {
    const vin = document.getElementById('vin-input').value.toUpperCase();
    
    if (!vin) {
        alert('请输入VIN车架号');
        return;
    }
    
    // 验证VIN格式（17位字符）
    if (vin.length !== 17) {
        alert('VIN车架号必须是17位字符');
        return;
    }
    
    // 动态解析VIN码
    const parsedVIN = parseVIN(vin);
    
    console.log('VIN解析结果:', parsedVIN);
    
    // 构建车辆信息
    let carInfo = {
        brand: parsedVIN.brand || '',
        vin: vin,
        chassis: parsedVIN.chassis,
        model: parsedVIN.model,
        year: parsedVIN.year || '2024'
    };
    
    // 如果无法识别品牌，显示提示
    if (!parsedVIN.brand) {
        document.getElementById('brandWarning').innerHTML = `
            <div style="color: #e53935; padding: 10px; background: #ffebee; border-radius: 4px; margin-bottom: 15px;">
                ⚠️ 警告：无法从VIN码识别品牌，请检查VIN码是否正确
            </div>
        `;
        return;
    } else {
        document.getElementById('brandWarning').innerHTML = '';
    }
    
    // 如果动态解析没有得到底盘号，尝试从数据库查询
    if (!carInfo.chassis) {
        try {
            const response = await fetch(getBasePath() + 'vin-data.json');
            if (!response.ok) {
                console.log('VIN数据文件不存在，跳过数据库查询');
                return;
            }
            const vinData = await response.json();
            
            // 检查VIN是否在数据库中
            if (vinData.vinMapping && vinData.vinMapping[vin]) {
                const vinInfo = vinData.vinMapping[vin];
                carInfo.chassis = vinInfo.chassis;
                carInfo.model = vinInfo.model;
            }
        } catch (error) {
            console.log('VIN数据文件不存在或加载失败:', error.message);
        }
    }
    
    // 如果无法推断底盘号，显示提示
    if (!carInfo.chassis) {
        document.getElementById('brandWarning').innerHTML = `
            <div style="color: #ff9800; padding: 10px; background: #fff3e0; border-radius: 4px; margin-bottom: 15px;">
                ⚠️ 提示：无法从VIN码推断底盘号，将按品牌(${carInfo.brand})查询配件
            </div>
        `;
    }
    
    showResults('VIN查询', carInfo);
}

// 6. 底盘号查询函数
function searchByChassis() {
    const chassis = document.getElementById('chassis-input').value.toUpperCase();
    
    if (!chassis) {
        alert('请输入底盘号');
        return;
    }
    
    showResults('底盘号查询', {
        chassis: chassis
    });
}

// 7. 车型查询函数
function searchByModel() {
    const brand = document.getElementById('model-brand').value;
    const series = document.getElementById('model-series').value;
    const type = document.getElementById('model-type').value;
    const year = document.getElementById('model-year').value;
    
    if (!brand || !series || !type) {
        alert('请填写完整查询信息');
        return;
    }
    
    // 从车型数据中获取底盘号
    let chassis = '';
    let seriesName = '';
    const brands = carModelsData.brands || {};
    const brandData = brands[brand];
    
    if (brandData && brandData.series && brandData.series[series]) {
        const seriesData = brandData.series[series];
        chassis = seriesData.chassis && seriesData.chassis[0] || '';
        seriesName = seriesData.name || '';
    }
    
    showResults('车型查询', {
        brand: brand === 'benz' ? '奔驰' : '宝马',
        series: seriesName || series,
        type: type,
        year: year || '2024',
        chassis: chassis
    });
}

// 8. 显示查询结果
async function showResults(searchType, carInfo) {
    // 显示结果区域
    document.getElementById('resultSection').style.display = 'block';
    
    // 底盘号到品牌的映射
    const chassisToBrand = {
        'W205': '奔驰', 'W213': '奔驰', 'W222': '奔驰', 'W204': '奔驰', 'W212': '奔驰',
        'W221': '奔驰', 'W203': '奔驰', 'W166': '奔驰', 'W251': '奔驰', 'W164': '奔驰',
        'W246': '奔驰', 'W253': '奔驰', 'W176': '奔驰', 'W117': '奔驰', 'W211': '奔驰',
        'W220': '奔驰', 'W218': '奔驰', 'W207': '奔驰', 'W447': '奔驰', 'W167': '奔驰',
        'W206': '奔驰', 'W254': '奔驰', 'W214': '奔驰', 'W223': '奔驰', 'W463': '奔驰',
        'F30': '宝马', 'F10': '宝马', 'F18': '宝马', 'G05': '宝马', 'G38': '宝马',
        'F35': '宝马', 'F25': '宝马', 'E90': '宝马', 'E60': '宝马', 'F02': '宝马',
        'E70': '宝马', 'F15': '宝马', 'F20': '宝马', 'G12': '宝马', 'G28': '宝马',
        'F49': '宝马', 'E84': '宝马', 'E83': '宝马', 'F07': '宝马', 'F16': '宝马',
        'G08': '宝马', 'G01': '宝马', 'G20': '宝马', 'G30': '宝马', 'F52': '宝马'
    };
    
    // 底盘号到车型的映射
    const chassisToModel = {
        'W205': 'C级', 'W213': 'E级', 'W222': 'S级', 'W204': 'C级', 'W212': 'E级',
        'W221': 'S级', 'W203': 'C级', 'W166': 'ML/GLE', 'W251': 'R级', 'W164': 'ML',
        'W246': 'B级', 'W253': 'GLC', 'W176': 'A级', 'W117': 'CLA', 'W211': 'E级',
        'W220': 'S级', 'W218': 'CLS', 'W207': 'E级Coupe', 'W447': 'V级', 'W167': 'GLE',
        'W206': 'C级', 'W254': 'C级', 'W214': 'E级', 'W223': 'S级', 'W463': 'G级',
        'F30': '3系', 'F10': '5系', 'F18': '5系', 'G05': 'X5', 'G38': '5系',
        'F35': '3系', 'F25': 'X3', 'E90': '3系', 'E60': '5系', 'F02': '7系',
        'E70': 'X5', 'F15': 'X5', 'F20': '1系', 'G12': '7系', 'G28': '3系',
        'F49': 'X1', 'E84': 'X1', 'E83': 'X3', 'F07': '5系GT', 'F16': 'X6',
        'G08': 'X3', 'G01': 'X3', 'G20': '3系', 'G30': '5系', 'F52': '1系'
    };
    
    // 根据底盘号推断品牌和车型
    if (carInfo.chassis) {
        const chassis = carInfo.chassis.toUpperCase();
        if (chassisToBrand[chassis]) {
            const inferredBrand = chassisToBrand[chassis];
            // 检查品牌是否匹配，自动修正品牌但不显示警告
            if (inferredBrand !== carInfo.brand) {
                carInfo.brand = inferredBrand;
            }
            document.getElementById('brandWarning').innerHTML = '';
        }
        if (chassisToModel[chassis]) {
            carInfo.model = chassisToModel[chassis];
        }
    }
    
    // 填充车辆信息
    let carInfoHTML = '';
    for (const [key, value] of Object.entries(carInfo)) {
        if (value) {
            let label = key;
            switch(key) {
                case 'brand': label = '品牌'; break;
                case 'vin': label = 'VIN码'; break;
                case 'chassis': label = '底盘号'; break;
                case 'series': label = '车系'; break;
                case 'type': label = '车型'; break;
                case 'model': label = '车型'; break;
                case 'year': label = '年份'; break;
            }
            carInfoHTML += `<p><strong>${label}：</strong>${value}</p>`;
        }
    }
    document.getElementById('carInfo').innerHTML = carInfoHTML;
    
    // 从产品数据中根据品牌和底盘号筛选配件
    const brand = carInfo.brand;
    const chassis = carInfo.chassis ? carInfo.chassis.toUpperCase() : '';
    
    console.log('查询条件 - 品牌:', brand, '底盘号:', chassis);
    
    // 读取产品数据文件和分类结构文件
    let products = [];
    let categoryMap = {};
    try {
        // 加载产品数据
        const productResponse = await fetch(getBasePath() + 'product-data.json');
        const productData = await productResponse.json();
        products = productData.products || [];
        console.log('加载产品数量:', products.length);

        // 加载分类结构数据
        const categoryResponse = await fetch(getBasePath() + 'category-structure.json');
        const categoryData = await categoryResponse.json();
        categoryMap = categoryData.product_map || categoryData.productMap || {};
        console.log('加载分类数量:', Object.keys(categoryMap).length);
    } catch (error) {
        console.error('加载数据失败:', error);
    }
    
    // 根据品牌筛选产品
    let filteredProducts = products.filter(product => product.series === brand);
    console.log('品牌筛选后数量:', filteredProducts.length);
    
    // 如果有底盘号，进一步筛选适配该底盘号的产品
    if (chassis) {
        filteredProducts = filteredProducts.filter(product => {
            const productModels = (product.model || '').toUpperCase();
            const targetChassis = chassis.toUpperCase();
            
            // 检查多种格式：
            // 1. 直接匹配（如 "F18"）
            if (productModels === targetChassis) {
                return true;
            }
            
            // 2. 斜杠分隔格式（如 "F18/F02"）
            const slashParts = productModels.split('/');
            if (slashParts.some(part => part.trim() === targetChassis)) {
                return true;
            }
            
            // 3. 逗号分隔格式（如 "F18/F02,F18/F02"）
            const commaParts = productModels.split(',');
            for (const part of commaParts) {
                const trimmedPart = part.trim();
                // 检查完整匹配
                if (trimmedPart === targetChassis) {
                    return true;
                }
                // 检查斜杠分隔中的匹配
                const subParts = trimmedPart.split('/');
                if (subParts.some(sub => sub.trim() === targetChassis)) {
                    return true;
                }
            }
            
            return false;
        });
    }
    
    // 转换为配件列表（显示所有适配配件）
    const parts = filteredProducts.map(product => {
        // 获取正确的分类信息
        let categoryDisplay = product.category;
        const productCode = product.code;
        if (categoryMap[productCode]) {
            const catInfo = categoryMap[productCode];
            categoryDisplay = (catInfo.system || product.category);
        }
        
        return {
            category: categoryDisplay,
            name: product.name,
            oe: product.code,
            sakoln: 'SK-' + product.code,
            status: '完全适配'
        };
    });
    
    let partsHTML = '';
    if (parts.length > 0) {
        parts.forEach(part => {
            partsHTML += `
                <tr>
                    <td>${part.category}</td>
                    <td class="part-name">${part.name}</td>
                    <td>${part.oe}</td>
                    <td>${part.sakoln}</td>
                    <td>${part.status}</td>
                    <td><a href="product-detail.html?oe=${encodeURIComponent(part.oe)}">查看详情</a></td>
                </tr>
            `;
        });
    } else {
        partsHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">暂无适配该车型的配件数据</td></tr>';
    }
    document.getElementById('partsTable').innerHTML = partsHTML;
}

// 9. 加载产品中心产品
async function loadHomeProducts() {
    console.log('=== 开始加载产品中心 ===');
    let products = [];
    
    // 优先从API获取数据
    try {
        const response = await fetch(getBasePath() + 'data/home_products.json?' + Date.now());
        console.log('产品中心API响应状态:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('产品中心API返回数据:', data);
            if (data.success && data.data) {
                products = data.data;
            } else if (Array.isArray(data)) {
                products = data;
            }
        }
    } catch (error) {
        console.log('从API加载产品数据失败:', error);
        // 降级到本地JSON文件
        try {
            const response = await fetch(getBasePath() + 'data/home_products.json?' + Date.now());
            if (response.ok) {
                products = await response.json();
            }
        } catch (e) {
            console.log('从本地文件加载产品数据也失败:', e);
        }
    }
    
    const homeProductsList = document.getElementById('homeProductsList');
    homeProductsList.innerHTML = '';
    
    console.log('产品中心产品数量:', products.length);
    
    // 如果没有数据，使用默认产品
    if (products.length === 0) {
        console.log('产品中心数据为空，使用默认数据');
        products = [
            {
                id: 1,
                name: '机油滤清器',
                oe: 'A2760940401',
                brand: '奔驰',
                stock: 150,
                image: 'img/chexing/benchiCji.jpg'
            },
            {
                id: 2,
                name: '空气滤清器',
                oe: '11427585256',
                brand: '宝马',
                stock: 85,
                image: 'img/chexing/BMW3xi.jpg'
            },
            {
                id: 3,
                name: '燃油滤清器',
                oe: 'A0001402780',
                brand: '奔驰',
                stock: 35,
                image: 'img/chexing/benchiEji.jpg'
            },
            {
                id: 4,
                name: '火花塞',
                oe: 'A2760100315',
                brand: '奔驰',
                stock: 95,
                image: 'img/chexing/benchiSji.jpg'
            },
            {
                id: 5,
                name: '刹车片',
                oe: '0054203712',
                brand: '奔驰',
                stock: 60,
                image: 'img/chexing/BMW5xi.jpg'
            }
        ];
    }
    
    // 缓存产品数据
    window.homeProductsCache = products;
    isProductsLoaded = true;
    
    // 显示产品（第一页5个）
    renderHomeProducts(products);
}

// 辅助函数：正确URL编码路径
function encodePath(path) {
    if (!path) return path;
    return encodeURI(path);
}

function renderHomeProducts(products) {
    const homeProductsList = document.getElementById('homeProductsList');
    homeProductsList.innerHTML = '';

    var basePath = getBasePath();
    const defaultImages = [
        basePath + 'img/chexing/benchiCji.jpg',
        basePath + 'img/chexing/BMW3xi.jpg',
        basePath + 'img/chexing/benchiEji.jpg',
        basePath + 'img/chexing/benchiSji.jpg',
        basePath + 'img/chexing/BMW5xi.jpg'
    ];

    products.slice(0, 5).forEach(function(product, index) {
        const productCard = document.createElement('a');
        productCard.className = 'product-card';
        productCard.href = basePath + 'product-detail.html?code=' + encodeURIComponent(product.oe);
        const defaultSrc = defaultImages[index % defaultImages.length];
        let imageSrc = product.image || defaultSrc;

        // 移除 http://localhost:8080 前缀
        if (imageSrc && imageSrc.startsWith('http://localhost:8080/')) {
            imageSrc = imageSrc.replace('http://localhost:8080/', '');
        } else if (imageSrc && imageSrc.startsWith('http://localhost:8080')) {
            imageSrc = imageSrc.replace('http://localhost:8080', '');
        }

        // 移除开头的斜杠
        if (imageSrc && imageSrc.startsWith('/')) {
            imageSrc = imageSrc.substring(1);
        }

        // 给产品图片路径加上 Gitee 仓库 URL（图片不上传到GitHub）
        if (imageSrc && !imageSrc.startsWith('http') && imageSrc.startsWith('fenlei-chanp-jpg/')) {
            imageSrc = getGiteeImageUrl(imageSrc);
        }

        // 正确URL编码路径
        imageSrc = encodePath(imageSrc);

        console.log('渲染产品:', product.name, '图片:', imageSrc);

        productCard.innerHTML = '\
            <div class="product-image">\
                <img referrerpolicy="no-referrer" src="' + imageSrc + '" alt="' + product.name + '" onerror="this.src=\'' + defaultSrc + '\'">\
            </div>\
            <div class="product-oe">OE: ' + product.oe + '</div>\
            <div class="product-name">' + product.name + '</div>\
            <div class="product-price">查看详情</div>\
            <div class="product-stock">库存: ' + product.stock + '件</div>\
        ';
        homeProductsList.appendChild(productCard);
    });
    console.log('=== 产品中心渲染完成 ===');
}

// 10. 加载爆款推荐产品
async function loadSelectedProducts() {
    console.log('=== 开始加载爆款推荐 ===');
    let products = [];
    
    // 优先从API获取数据
    try {
        const response = await fetch(getBasePath() + 'data/hot_products.json?' + Date.now());
        console.log('爆款API响应状态:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('爆款API返回数据:', data);
            if (data.success && data.data) {
                products = data.data;
            } else if (Array.isArray(data)) {
                products = data;
            }
        }
    } catch (error) {
        console.log('从API加载爆款数据失败:', error);
        // 降级到本地JSON文件
        try {
            const response = await fetch(getBasePath() + 'data/hot_products.json?' + Date.now());
            if (response.ok) {
                const data = await response.json();
                products = data.products || data || [];
            }
        } catch (e) {
            console.log('从本地文件加载爆款数据也失败:', e);
        }
    }
    
    const hotProductsList = document.getElementById('hotProductsList');
    hotProductsList.innerHTML = '';
    
    console.log('爆款产品数量:', products.length);
    
    // 如果服务器没有数据，使用默认产品
    if (products.length === 0) {
        console.log('爆款数据为空，使用默认数据');
        products = [
            {
                id: 1,
                name: '机油滤清器',
                oe: 'A2760940401',
                brand: '奔驰',
                stock: 150,
                image: 'img/chexing/benchiCji.jpg'
            },
            {
                id: 2,
                name: '空气滤清器',
                oe: '11427585256',
                brand: '宝马',
                stock: 85,
                image: 'img/chexing/BMW3xi.jpg'
            },
            {
                id: 3,
                name: '燃油滤清器',
                oe: 'A0001402780',
                brand: '奔驰',
                stock: 35,
                image: 'img/chexing/benchiEji.jpg'
            },
            {
                id: 4,
                name: '火花塞',
                oe: 'A2760100315',
                brand: '奔驰',
                stock: 95,
                image: 'img/chexing/benchiSji.jpg'
            },
            {
                id: 5,
                name: '刹车片',
                oe: '0054203712',
                brand: '奔驰',
                stock: 60,
                image: 'img/chexing/BMW5xi.jpg'
            }
        ];
    }
    
    // 缓存产品数据
    window.hotProductsCache = products;
    isHotProductsLoaded = true;
    
    // 调用渲染函数
    renderHotProducts(products);
    
    console.log('=== 爆款推荐加载完成 ===');
}

function renderHotProducts(products) {
    const hotProductsList = document.getElementById('hotProductsList');
    hotProductsList.innerHTML = '';

    var basePath = getBasePath();
    const defaultImages = [
        basePath + 'img/chexing/benchiCji.jpg',
        basePath + 'img/chexing/BMW3xi.jpg',
        basePath + 'img/chexing/benchiEji.jpg',
        basePath + 'img/chexing/benchiSji.jpg',
        basePath + 'img/chexing/BMW5xi.jpg'
    ];

    products.slice(0, 5).forEach(function(product, index) {
        const productCard = document.createElement('a');
        productCard.className = 'product-card';
        productCard.href = basePath + 'product-detail.html?code=' + encodeURIComponent(product.oe);
        const defaultSrc = defaultImages[index % defaultImages.length];
        let imageSrc = product.image || defaultSrc;

        // 移除 http://localhost:8080 前缀
        if (imageSrc && imageSrc.startsWith('http://localhost:8080/')) {
            imageSrc = imageSrc.replace('http://localhost:8080/', '');
        } else if (imageSrc && imageSrc.startsWith('http://localhost:8080')) {
            imageSrc = imageSrc.replace('http://localhost:8080', '');
        }

        // 移除开头的斜杠
        if (imageSrc && imageSrc.startsWith('/')) {
            imageSrc = imageSrc.substring(1);
        }

        // 给产品图片路径加上 Gitee 仓库 URL（图片不上传到GitHub）
        if (imageSrc && !imageSrc.startsWith('http') && imageSrc.startsWith('fenlei-chanp-jpg/')) {
            imageSrc = getGiteeImageUrl(imageSrc);
        }

        // 正确URL编码路径
        imageSrc = encodePath(imageSrc);

        console.log('渲染爆款产品:', product.name, '图片:', imageSrc);

        productCard.innerHTML = '\
            <div class="product-image">\
                <img referrerpolicy="no-referrer" src="' + imageSrc + '" alt="' + product.name + '" onerror="this.src=\'' + defaultSrc + '\'">\
            </div>\
            <div class="product-oe">OE: ' + product.oe + '</div>\
            <div class="product-name">' + product.name + '</div>\
            <div class="product-price">查看详情</div>\
            <div class="product-stock">库存: ' + product.stock + '件</div>\
        ';
        hotProductsList.appendChild(productCard);
    });
}

// 热门车型查看配件功能
window.viewModelParts = function(chassis) {
    // 切换到底盘号查询标签
    const chassisTab = document.querySelector('.search-tab[data-tab="chassis-tab"]');
    if (chassisTab) {
        chassisTab.click();
    }
    
    // 设置底盘号输入框
    const chassisInput = document.getElementById('chassis-input');
    if (chassisInput) {
        chassisInput.value = chassis;
    }
    
    // 执行查询
    searchByChassis();
    
    // 滚动到车型查询区域
    const carModelsSection = document.getElementById('car-models');
    if (carModelsSection) {
        carModelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// 页面加载时加载后台选中的产品
function initProducts() {
    console.log('DOM加载完成，开始加载产品数据...');
    loadSelectedProducts();
    loadHomeProducts();
}

// 确保初始化在所有情况下都执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
} else {
    // DOM已经加载完成，直接执行
    initProducts();
}
