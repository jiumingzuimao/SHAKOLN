// 产品加载脚本 - 俄文版 - 从 product-data.json 和 product-images.json 加载
// 产品图片从 Gitee 仓库加载
console.log('=== Product Loading Script Started (Russian) ===');

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

// 俄文翻译词典
const ruTranslator = {
    categories: {
        '发动机配件': 'Запчасти двигателя',
        '变速箱配件': 'Запчасти КПП',
        '转向系统': 'Система рулевого управления',
        '制动系统': 'Тормозная система',
        '车身内饰': 'Интерьер салона',
        '车灯照明': 'Освещение',
        '通用密封橡胶件': 'Уплотнения и резинотехнические изделия',
        '空调系统': 'Система кондиционирования',
        '底盘传动系统': 'Ходовая часть и трансмиссия',
        '进气排气系统': 'Система впуска и выпуска',
        '车身外观': 'Кузовные детали',
        '电器电控': 'Электроника',
        '悬挂减震系统': 'Подвеска',
        '冷却系统': 'Система охлаждения',
        '精品系列': 'Премиум'
    },
    productNames: {
        '副水壶': 'Расширительный бак',
        '机油滤清器': 'Масляный фильтр',
        '空气滤清器': 'Воздушный фильтр',
        '燃油滤清器': 'Топливный фильтр',
        '空调滤清器': 'Фильтр салона',
        '刹车片': 'Тормозные колодки',
        '刹车盘': 'Тормозной диск',
        '火花塞': 'Свеча зажигания',
        '水泵': 'Водяной насос',
        '电子水泵': 'Электрический водяной насос',
        '正时皮带': 'Ремень ГРМ',
        '电池': 'Аккумулятор',
        '轮胎': 'Шина',
        '减震器': 'Амортизатор',
        '滤清器': 'Фильтр',
        '机油格': 'Масляный фильтр',
        '空气格': 'Воздушный фильтр',
        '汽油格': 'Топливный фильтр',
        '空调格': 'Фильтр салона',
        '前上摆臂L': 'Передний верхний рычаг L',
        '前上摆臂R': 'Передний верхний рычаг R',
        '前下摆臂L': 'Передний нижний рычаг L',
        '前下摆臂R': 'Передний нижний рычаг R',
        '下摆臂': 'Нижний рычаг',
        '上摆臂': 'Верхний рычаг',
        '摆臂': 'Рычаг',
        '机油泵油底壳': 'Поддон масляного насоса',
        '电子扇': 'Электрический вентилятор',
        '电子扇850W': 'Электрический вентилятор 850Вт',
        '气门室盖': 'Крышка клапанов',
        '前减震器R（4驱）': 'Передний амортизатор R (4WD)',
        '减震器避震': 'Амортизатор',
        '发动机油底壳': 'Поддон двигателя',
        '右前半轴': 'Правый передний полуось',
        '密封圈': 'Уплотнительное кольцо',
        '密封圈-回油管路': 'Уплотнение обратного маслопровода',
        '密封圈-缸盖': 'Уплотнение ГБЦ',
        '变速箱油管胶圈': 'Уплотнение трубопровода КПП',
        '机油尺': 'Щуп уровня масла',
        '机油尺导管': 'Трубка щупа масла',
        '机油泵': 'Масляный насос',
        '机油泵链条': 'Цепь масляного насоса',
        '机油泵链轮': 'Звездочка масляного насоса',
        '机油泵涨紧器': 'Натяжитель цепи масляного насоса',
        '机油泵减压阀': 'Предохранительный клапан масляного насоса',
        '机油泵盖': 'Крышка масляного насоса',
        '真空泵': 'Вакуумный насос',
        '真空泵修理包': 'Ремкомплект вакуумного насоса',
        '刹车总泵': 'Главный тормозной цилиндр',
        '刹车分泵': 'Колесный тормозной цилиндр',
        '刹车助力器': 'Усилитель тормозов',
        '手刹模块': 'Модуль ручного тормоза'
    },
    translateText: function(text) {
        if (!text) return text;
        const commonTerms = {
            '全铝': ' Алюминий',
            '铝': ' Алюминий',
            '铝合金': ' Алюминиевый сплав',
            '塑料': ' Пластик',
            '橡胶': ' Резина',
            '钢': ' Сталь',
            '不锈钢': ' Нержавеющая сталь',
            '原厂': ' Оригинал',
            '副厂': ' Неоригинал',
            '配套': ' OE',
            'L': ' L',
            'R': ' R',
            '左': ' Левый',
            '右': ' Правый',
            '前': ' Передний',
            '后': ' Задний',
            '上': ' Верхний',
            '下': ' Нижний',
            '内': ' Внутренний',
            '外': ' Внешний',
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
                {cn: 'L', ru: ' L'},
                {cn: 'R', ru: ' R'},
                {cn: '全铝', ru: ' (Алюминий)'}
            ];
            for (let suffix of commonSuffixes) {
                if (translatedName && translatedName.endsWith(suffix.cn)) {
                    const baseName = translatedName.substring(0, translatedName.length - suffix.cn.length);
                    if (this.productNames[baseName]) {
                        translatedName = this.productNames[baseName] + suffix.ru;
                        break;
                    }
                }
            }
        }
        let translatedStock = product.stock;
        if (product.stock === '充足') translatedStock = 'В наличии';
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

// 渲染产品到指定容器（俄文版）
function renderProductsCore(containerId, products, basePath, language) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.log('Container not found:', containerId);
        return;
    }

    container.innerHTML = '';
    console.log('Rendering products to', containerId, ', count:', products.length);

    // 翻译产品
    var translatedProducts = ruTranslator.translateProducts(products);

    var defaultImages = [
        basePath + 'img/chexing/benchiCji.jpg',
        basePath + 'img/chexing/BMW3xi.jpg',
        basePath + 'img/chexing/benchiEji.jpg',
        basePath + 'img/chexing/benchiSji.jpg',
        basePath + 'img/chexing/BMW5xi.jpg'
    ];

    var oeLabel = 'OE: ';
    var viewDetail = 'Подробнее';
    var stockLabel = 'Запас: ';
    var unit = ' шт';

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
        card.href = basePath + 'ru/product-detail.html?oe=' + encodeURIComponent(product.code);

        var img = document.createElement('img');
        img.alt = product.name;
        img.referrerPolicy = 'no-referrer';
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
        // 优先尝试加载后台保存的产品中心和爆款推荐数据
        function tryAdminData() {
            var adminResults = { home: null, hot: null };
            var loadedCount = 0;

            fetch(basePath + 'data/home_products.json?' + Date.now())
                .then(function(r) { return r.ok ? r.json() : null; })
                .then(function(homeData) {
                    if (homeData && Array.isArray(homeData) && homeData.length > 0) {
                        adminResults.home = homeData.map(function(p) { return { code: p.oe, name: p.name, stock: p.stock, image: p.image }; });
                    }
                    loadedCount++;
                    checkComplete();
                })
                .catch(function() { loadedCount++; checkComplete(); });

            fetch(basePath + 'data/hot_products.json?' + Date.now())
                .then(function(r) { return r.ok ? r.json() : null; })
                .then(function(hotData) {
                    if (hotData && Array.isArray(hotData) && hotData.length > 0) {
                        adminResults.hot = hotData.map(function(p) { return { code: p.oe, name: p.name, stock: p.stock, image: p.image }; });
                    }
                    loadedCount++;
                    checkComplete();
                })
                .catch(function() { loadedCount++; checkComplete(); });

            function checkComplete() {
                if (loadedCount >= 2) {
                    if (adminResults.home && adminResults.hot) {
                        console.log('Using admin-saved products - home:', adminResults.home.length, ', hot:', adminResults.hot.length);
                        renderProductsCore(hotContainerId, adminResults.hot, basePath, language);
                        renderProductsCore(homeContainerId, adminResults.home, basePath, language);
                    } else {
                        console.log('No admin data, using default logic...');
                        loadWithDefaultLogic();
                    }
                }
            }
        }

        // 默认逻辑：从产品主数据中筛选
        function loadWithDefaultLogic() {
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
        }

        // 启动：优先尝试后台数据
        tryAdminData();
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
        loadHomepageProducts('hotProductsList', 'homeProductsList', 'ru');
    }
}, 2000);

// 自动启动：俄文版
startLoadingProducts('ru');

console.log('=== Product Loading Script Initialization Complete (Russian) ===');
