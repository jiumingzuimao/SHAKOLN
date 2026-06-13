// 产品加载脚本 - 英文版 - 从 product-data.json 和 product-images.json 加载
// 产品图片从 Gitee 仓库加载
console.log('=== Product Loading Script Started (English) ===');

function getGiteeImageUrl(imgPath) {
    if (imgPath && imgPath.indexOf('baoma/') === 0) {
        return 'https://gitee.com/shakoln/baoma-img2/raw/main/' + imgPath.replace('baoma/', '');
    } else if (imgPath && imgPath.indexOf('benchi/') === 0) {
        return 'https://gitee.com/shakoln/benchi-img2/raw/master/' + imgPath.replace('benchi/', '');
    }
    return imgPath;
}

// 全局缓存
var productImagesMap = {};

// 检测当前页面是否在子目录中（如 /en/, /ru/, /ar/）
function getBasePath() {
    var path = window.location.pathname;
    if (path.indexOf('/en/') >= 0 || path.indexOf('/ru/') >= 0 || path.indexOf('/ar/') >= 0) {
        return './';
    }
    return '';
}

// 对URL进行编码
function encodePath(path) {
    if (!path) return path;
    return encodeURI(path);
}

// 英文翻译词典
const enTranslator = {
    categories: {
        '发动机配件': 'Engine Parts',
        '变速箱配件': 'Transmission Parts',
        '转向系统': 'Steering System',
        '制动系统': 'Brake System',
        '车身内饰': 'Interior Parts',
        '车灯照明': 'Lighting',
        '通用密封橡胶件': 'Seals & Rubber',
        '空调系统': 'AC System',
        '底盘传动系统': 'Chassis & Drivetrain',
        '进气排气系统': 'Intake & Exhaust',
        '车身外观': 'Exterior Parts',
        '电器电控': 'Electrical System',
        '悬挂减震系统': 'Suspension',
        '冷却系统': 'Cooling System',
        '精品系列': 'Premium'
    },
    productNames: {
        '副水壶': 'Expansion Tank',
        '机油滤清器': 'Oil Filter',
        '空气滤清器': 'Air Filter',
        '燃油滤清器': 'Fuel Filter',
        '空调滤清器': 'Cabin Filter',
        '刹车片': 'Brake Pads',
        '刹车盘': 'Brake Disc',
        '火花塞': 'Spark Plug',
        '水泵': 'Water Pump',
        '电子水泵': 'Electric Water Pump',
        '正时皮带': 'Timing Belt',
        '电池': 'Battery',
        '轮胎': 'Tire',
        '减震器': 'Shock Absorber',
        '滤清器': 'Filter',
        '机油格': 'Oil Filter',
        '空气格': 'Air Filter',
        '汽油格': 'Fuel Filter',
        '空调格': 'Cabin Filter',
        '前上摆臂L': 'Front Upper Control Arm Left',
        '前上摆臂R': 'Front Upper Control Arm Right',
        '前下摆臂L': 'Front Lower Control Arm Left',
        '前下摆臂R': 'Front Lower Control Arm Right',
        '下摆臂': 'Lower Control Arm',
        '上摆臂': 'Upper Control Arm',
        '摆臂': 'Control Arm',
        '机油泵油底壳': 'Oil Pump Oil Pan',
        '电子扇': 'Electric Fan',
        '电子扇850W': 'Electric Fan 850W',
        '气门室盖': 'Valve Cover',
        '前减震器R（4驱）': 'Front Shock Absorber Right (4WD)',
        '减震器避震': 'Shock Absorber',
        '发动机油底壳': 'Engine Oil Pan',
        '右前半轴': 'Right Front Axle Shaft',
        '密封圈': 'Seal Ring',
        '密封圈-回油管路': 'Return Line Seal Ring',
        '密封圈-缸盖': 'Cylinder Head Seal',
        '变速箱油管胶圈': 'Transmission Line Seal',
        '机油尺': 'Oil Dipstick',
        '机油尺导管': 'Oil Dipstick Tube',
        '机油泵': 'Oil Pump',
        '机油泵链条': 'Oil Pump Chain',
        '机油泵链轮': 'Oil Pump Sprocket',
        '机油泵涨紧器': 'Oil Pump Tensioner',
        '机油泵减压阀': 'Oil Pump Relief Valve',
        '机油泵盖': 'Oil Pump Cover',
        '真空泵': 'Vacuum Pump',
        '真空泵修理包': 'Vacuum Pump Repair Kit',
        '刹车总泵': 'Brake Master Cylinder',
        '刹车分泵': 'Brake Wheel Cylinder',
        '刹车助力器': 'Brake Booster',
        '手刹模块': 'Handbrake Module'
    },
    translateText: function(text) {
        if (!text) return text;
        const commonTerms = {
            '全铝': ' All Aluminum',
            '铝': ' Aluminum',
            '铝合金': ' Aluminum Alloy',
            '塑料': ' Plastic',
            '橡胶': ' Rubber',
            '钢': ' Steel',
            '不锈钢': ' Stainless Steel',
            '原厂': ' Original',
            '副厂': ' Aftermarket',
            '配套': ' OE',
            'L': ' Left',
            'R': ' Right',
            '左': ' Left',
            '右': ' Right',
            '前': ' Front',
            '后': ' Rear',
            '上': ' Upper',
            '下': ' Lower',
            '内': ' Inner',
            '外': ' Outer',
            '4驱': ' (4WD)',
            '四驱': ' (4WD)'
        };
        let translatedText = text;
        if (this.productNames[text]) {
            return this.productNames[text];
        }
        for (let cn in commonTerms) {
            if (translatedText.includes(cn)) {
                translatedText = translatedText.split(cn).join(commonTerms[cn]);
            }
        }
        return translatedText;
    },
    translateProduct: function(product) {
        if (!product) return product;
        let translatedName = product.name || '';
        if (this.productNames[product.name]) {
            translatedName = this.productNames[product.name];
        } else {
            const commonSuffixes = [
                {cn: 'L', en: ' Left'},
                {cn: 'R', en: ' Right'},
                {cn: '全铝', en: ' (All Aluminum)'}
            ];
            for (let suffix of commonSuffixes) {
                if (translatedName && translatedName.endsWith(suffix.cn)) {
                    const baseName = translatedName.substring(0, translatedName.length - suffix.cn.length);
                    if (this.productNames[baseName]) {
                        translatedName = this.productNames[baseName] + suffix.en;
                        break;
                    }
                }
            }
        }
        let translatedStock = product.stock;
        if (product.stock === '充足') translatedStock = 'In Stock';
        return {
            ...product,
            name: translatedName,
            stock: translatedStock
        };
    },
    translateProducts: function(products) {
        if (!products || !Array.isArray(products)) return [];
        return products.map(product => this.translateProduct(product));
    }
};

// 加载产品图片映射
function loadProductImagesMap(basePath, callback) {
    fetch(basePath + 'product-images.json?' + Date.now())
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Image map load failed');
        })
        .then(function(data) {
            productImagesMap = data;
            console.log('Product image map loaded, count:', Object.keys(productImagesMap).length);
            callback(null, productImagesMap);
        })
        .catch(function(error) {
            console.error('Failed to load product image map:', error);
            productImagesMap = {};
            callback(error, {});
        });
}

// 检查产品是否有图片
function hasProductImage(productCode) {
    var images = productImagesMap[String(productCode)];
    return images !== undefined && images.length > 0;
}

// 获取产品第一张图片路径（从Gitee仓库加载）
function getProductImagePath(productCode) {
    var images = productImagesMap[String(productCode)];
    if (images && images.length > 0) {
        return getGiteeImageUrl(images[0]);
    }
    return null;
}

// 渲染产品到指定容器（英文版）
function renderProductsCore(containerId, products, basePath, language) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.log('Container not found:', containerId);
        return;
    }

    container.innerHTML = '';
    console.log('Rendering products to', containerId, ', count:', products.length);

    // 翻译产品
    var translatedProducts = enTranslator.translateProducts(products);

    var defaultImages = [
        basePath + 'img/chexing/benchiCji.jpg',
        basePath + 'img/chexing/BMW3xi.jpg',
        basePath + 'img/chexing/benchiEji.jpg',
        basePath + 'img/chexing/benchiSji.jpg',
        basePath + 'img/chexing/BMW5xi.jpg'
    ];

    var oeLabel = 'OE: ';
    var viewDetail = 'View Details';
    var stockLabel = 'Stock: ';
    var unit = ' pcs';

    for (var i = 0; i < Math.min(translatedProducts.length, 5); i++) {
        var product = translatedProducts[i];
        var defaultSrc = defaultImages[i % defaultImages.length];
        var imgSrc;

        if (hasProductImage(product.code)) {
            imgSrc = getProductImagePath(product.code);
        } else if (product.image) {
            if (product.image.startsWith('http')) {
                imgSrc = product.image;
            } else if (product.image.startsWith('/')) {
                imgSrc = product.image;
            } else if (product.image.startsWith('fenlei-chanp-jpg/')) {
                imgSrc = getGiteeImageUrl(product.image);
            } else {
                imgSrc = defaultSrc;
            }
        } else {
            imgSrc = defaultSrc;
        }

        var encodedImgSrc = encodePath(imgSrc);

        var card = document.createElement('a');
        card.className = 'product-card';
        card.href = basePath + 'en/product-detail.html?oe=' + encodeURIComponent(product.code);

        var img = document.createElement('img');
        img.alt = product.name;
        img.src = encodedImgSrc;
        img.dataset.productIndex = i;
        img.dataset.originalSrc = imgSrc;
        img.dataset.defaultSrc = defaultSrc;

        img.onload = function() {
            console.log('Image loaded successfully:', this.dataset.productIndex, this.src);
        };
        img.onerror = function() {
            console.error('Image load failed:', this.dataset.productIndex, this.src);
            if (this.dataset.originalSrc !== this.dataset.defaultSrc) {
                this.src = encodePath(this.dataset.defaultSrc);
            }
        };

        var imageDiv = document.createElement('div');
        imageDiv.className = 'product-image';
        imageDiv.appendChild(img);

        var oeDiv = document.createElement('div');
        oeDiv.className = 'product-oe';
        oeDiv.textContent = oeLabel + product.code;

        var nameDiv = document.createElement('div');
        nameDiv.className = 'product-name';
        nameDiv.textContent = product.name;

        var priceDiv = document.createElement('div');
        priceDiv.className = 'product-price';
        priceDiv.textContent = viewDetail;

        var stockDiv = document.createElement('div');
        stockDiv.className = 'product-stock';
        stockDiv.textContent = stockLabel + product.stock + unit;

        card.appendChild(imageDiv);
        card.appendChild(oeDiv);
        card.appendChild(nameDiv);
        card.appendChild(priceDiv);
        card.appendChild(stockDiv);

        container.appendChild(card);
    }

    console.log(containerId, 'rendering complete');
}

// 加载首页产品数据
function loadHomepageProducts(hotContainerId, homeContainerId, language) {
    var basePath = getBasePath();

    loadProductImagesMap(basePath, function(imgErr, imgMap) {
        fetch(basePath + 'product-data.json?' + Date.now())
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Product data load failed');
            })
            .then(function(data) {
                var allProducts = [];
                if (data.products) {
                    allProducts = data.products;
                } else if (Array.isArray(data)) {
                    allProducts = data;
                }
                console.log('Product data loaded, total:', allProducts.length);

                var orderMap = {};
                fetch(basePath + 'data/product_orders.json?' + Date.now())
                    .then(function(ordResponse) {
                        if (ordResponse.ok) {
                            return ordResponse.json();
                        }
                        return null;
                    })
                    .then(function(ordData) {
                        if (ordData && Array.isArray(ordData)) {
                            ordData.forEach(function(item) {
                                if (item.code && item.frontOrder) {
                                    orderMap[String(item.code)] = item.frontOrder;
                                }
                            });
                        }
                        console.log('Order settings loaded, count:', Object.keys(orderMap).length);

                        var productsWithImages = allProducts.filter(function(p) {
                            return hasProductImage(p.code);
                        });
                        console.log('Products with images:', productsWithImages.length);

                        var homeProducts = productsWithImages.slice(0, 5);

                        var productsWithOrder = productsWithImages.filter(function(p) {
                            return orderMap[String(p.code)] !== undefined;
                        }).sort(function(a, b) {
                            return (orderMap[String(a.code)] || 999) - (orderMap[String(b.code)] || 999);
                        });

                        var hotProducts = [];
                        if (productsWithOrder.length >= 5) {
                            hotProducts = productsWithOrder.slice(0, 5);
                        } else {
                            var orderedCodes = productsWithOrder.map(function(p) { return p.code; });
                            var remaining = productsWithImages.filter(function(p) {
                                return orderedCodes.indexOf(p.code) < 0;
                            });
                            hotProducts = productsWithOrder.concat(remaining).slice(0, 5);
                        }

                        console.log('Home products:', homeProducts.length, ', Hot products:', hotProducts.length);

                        renderProductsCore(hotContainerId, hotProducts, basePath, language);
                        renderProductsCore(homeContainerId, homeProducts, basePath, language);
                    })
                    .catch(function(ordErr) {
                        console.log('Order settings load failed, using default sort:', ordErr);
                        var productsWithImages = allProducts.filter(function(p) {
                            return hasProductImage(p.code);
                        });
                        var homeProducts = productsWithImages.slice(0, 5);
                        var hotProducts = productsWithImages.slice(0, 5);
                        renderProductsCore(hotContainerId, hotProducts, basePath, language);
                        renderProductsCore(homeContainerId, homeProducts, basePath, language);
                    });
            })
            .catch(function(error) {
                console.error('Product data load failed:', error);
            });
    });
}

// 页面加载完成后执行
function startLoadingProducts(language) {
    console.log('Waiting for DOM ready...');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM ready, loading homepage products');
        loadHomepageProducts('hotProductsList', 'homeProductsList', language);
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('DOM already ready, executing immediately');
        loadHomepageProducts('hotProductsList', 'homeProductsList', language);
    }
}

// 延迟执行作为安全机制
setTimeout(function() {
    var hotContainer = document.getElementById('hotProductsList');
    var homeContainer = document.getElementById('homeProductsList');
    if ((hotContainer && hotContainer.children.length === 0) || (homeContainer && homeContainer.children.length === 0)) {
        console.log('Safety check: containers still empty, reloading...');
        loadHomepageProducts('hotProductsList', 'homeProductsList', 'en');
    }
}, 2000);

// 自动启动：英文版
startLoadingProducts('en');

console.log('=== Product Loading Script Initialization Complete (English) ===');
