// 产品加载脚本 - 从 product-data.json 和 product-images.json 加载
// 产品图片从 Gitee 仓库加载
console.log('=== 产品加载脚本启动 (从产品数据JSON加载) ===');

// 产品图片Gitee路由转换（baoma → baoma-img2, benchi → benchi-img2）
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
        return '../';
    }
    return '';
}

// 对URL进行编码
function encodePath(path) {
    if (!path) return path;
    return encodeURI(path);
}

// 加载产品图片映射
function loadProductImagesMap(basePath, callback) {
    fetch(basePath + 'product-images.json?' + Date.now())
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('图片映射加载失败');
        })
        .then(function(data) {
            productImagesMap = data;
            console.log('产品图片映射加载成功，图片数量:', Object.keys(productImagesMap).length);
            callback(null, productImagesMap);
        })
        .catch(function(error) {
            console.error('加载产品图片映射失败:', error);
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

// 渲染产品到指定容器（语言无关的核心逻辑）
function renderProductsCore(containerId, products, basePath, language) {
    var container = document.getElementById(containerId);
    if (!container) {
        console.log('找不到容器:', containerId);
        return;
    }

    container.innerHTML = '';
    console.log('开始渲染产品到', containerId, '，产品数量:', products.length);

    var defaultImages = [
        basePath + 'img/chexing/benchiCji.jpg',
        basePath + 'img/chexing/BMW3xi.jpg',
        basePath + 'img/chexing/benchiEji.jpg',
        basePath + 'img/chexing/benchiSji.jpg',
        basePath + 'img/chexing/BMW5xi.jpg'
    ];

    var oeLabel = 'OE: ';
    var viewDetail = '查看详情';
    var stockLabel = '库存: ';
    var unit = '件';

    // 语言定制化UI文本
    if (language === 'en') {
        oeLabel = 'OE: ';
        viewDetail = 'View Details';
        stockLabel = 'Stock: ';
        unit = ' pcs';
    } else if (language === 'ru') {
        oeLabel = 'OE: ';
        viewDetail = 'Подробнее';
        stockLabel = 'Запас: ';
        unit = ' шт';
    } else if (language === 'ar') {
        oeLabel = 'OE: ';
        viewDetail = 'عرض التفاصيل';
        stockLabel = 'المخزون: ';
        unit = ' قطعة';
    }

    for (var i = 0; i < Math.min(products.length, 5); i++) {
        var product = products[i];
        var defaultSrc = defaultImages[i % defaultImages.length];
        var imgSrc;

        // 从 productImagesMap 根据 code 查找图片
        if (hasProductImage(product.code)) {
            imgSrc = getProductImagePath(product.code);
        } else if (product.image) {
            // 兼容老格式
            if (product.image.startsWith('http')) {
                imgSrc = product.image;
            } else if (product.image.startsWith('/')) {
                imgSrc = product.image;
            } else if (product.image.startsWith('baoma/') || product.image.startsWith('benchi/')) {
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
        card.href = basePath + 'product-detail.html?oe=' + encodeURIComponent(product.code);

        var img = document.createElement('img');
        img.alt = product.name;
        img.referrerPolicy = 'no-referrer';
        img.src = encodedImgSrc;
        img.dataset.productIndex = i;
        img.dataset.originalSrc = imgSrc;
        img.dataset.defaultSrc = defaultSrc;

        img.onload = function() {
            console.log('图片加载成功:', this.dataset.productIndex, this.src);
        };
        img.onerror = function() {
            console.error('图片加载失败:', this.dataset.productIndex, this.src);
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

    console.log(containerId, '渲染完成');
}

// 加载首页产品数据（产品中心和爆款中心共用）
function loadHomepageProducts(hotContainerId, homeContainerId, language) {
    var basePath = getBasePath();

    // 1. 加载产品图片映射
    loadProductImagesMap(basePath, function(imgErr, imgMap) {
        // 1A. 优先尝试加载后台保存的产品中心和爆款推荐数据
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
                        console.log('使用后台保存的产品数据 - 产品中心:', adminResults.home.length, '，爆款推荐:', adminResults.hot.length);
                        renderProductsCore(hotContainerId, adminResults.hot, basePath, language);
                        renderProductsCore(homeContainerId, adminResults.home, basePath, language);
                    } else {
                        console.log('后台数据文件不存在或为空，回退到默认逻辑...');
                        loadWithDefaultLogic();
                    }
                }
            }
        }

        // 2. 默认逻辑：从产品主数据中筛选
        function loadWithDefaultLogic() {
        fetch(basePath + 'product-data.json?' + Date.now())
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('产品数据加载失败');
            })
            .then(function(data) {
                var allProducts = [];
                if (data.products) {
                    allProducts = data.products;
                } else if (Array.isArray(data)) {
                    allProducts = data;
                }
                console.log('产品数据加载成功，产品总数:', allProducts.length);

                // 3. 加载序号设置用于爆款排序
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
                        console.log('序号设置加载成功，有序号的产品数:', Object.keys(orderMap).length);

                        // 4. 筛选有图片的产品
                        var productsWithImages = allProducts.filter(function(p) {
                            return hasProductImage(p.code);
                        });
                        console.log('有图片的产品数量:', productsWithImages.length);

                        // 5. 产品中心：取前5个有图片的产品
                        var homeProducts = productsWithImages.slice(0, 5);

                        // 6. 爆款产品：根据 frontOrder 排序，取前5个
                        var hotProducts = [];
                        var productsWithOrder = productsWithImages.filter(function(p) {
                            return orderMap[String(p.code)] !== undefined;
                        }).sort(function(a, b) {
                            return (orderMap[String(a.code)] || 999) - (orderMap[String(b.code)] || 999);
                        });

                        if (productsWithOrder.length >= 5) {
                            hotProducts = productsWithOrder.slice(0, 5);
                        } else {
                            // 如果有序号的产品不够，用有图片的产品补充
                            var orderedCodes = productsWithOrder.map(function(p) { return p.code; });
                            var remaining = productsWithImages.filter(function(p) {
                                return orderedCodes.indexOf(p.code) < 0;
                            });
                            hotProducts = productsWithOrder.concat(remaining).slice(0, 5);
                        }

                        console.log('产品中心产品数:', homeProducts.length, '，爆款产品数:', hotProducts.length);

                        // 7. 渲染
                        renderProductsCore(hotContainerId, hotProducts, basePath, language);
                        renderProductsCore(homeContainerId, homeProducts, basePath, language);
                    })
                    .catch(function(ordErr) {
                        console.log('序号设置加载失败，不影响主流程:', ordErr);
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
                console.error('产品数据加载失败:', error);
                // 加载失败时什么都不做，保持空容器
            });
        }

        // 启动：优先尝试后台数据
        tryAdminData();
    });
}

// 页面加载完成后执行
function startLoadingProducts(language) {
    console.log('等待DOM就绪...');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM就绪，开始加载首页产品');
        loadHomepageProducts('hotProductsList', 'homeProductsList', language);
    });

    // 如果DOM已经加载，立即执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('DOM已就绪，立即执行');
        loadHomepageProducts('hotProductsList', 'homeProductsList', language);
    }
}

// 延迟执行作为安全机制
setTimeout(function() {
    var hotContainer = document.getElementById('hotProductsList');
    var homeContainer = document.getElementById('homeProductsList');
    if ((hotContainer && hotContainer.children.length === 0) || (homeContainer && homeContainer.children.length === 0)) {
        console.log('延迟检查：容器仍为空，重新加载...');
        var lang = '';
        var path = window.location.pathname;
        if (path.indexOf('/en/') >= 0) lang = 'en';
        else if (path.indexOf('/ru/') >= 0) lang = 'ru';
        else if (path.indexOf('/ar/') >= 0) lang = 'ar';
        loadHomepageProducts('hotProductsList', 'homeProductsList', lang);
    }
}, 2000);

// 导出到全局供其他脚本使用
window.loadHomepageProducts = loadHomepageProducts;
window.renderProductsCore = renderProductsCore;
window.hasProductImage = hasProductImage;
window.getProductImagePath = getProductImagePath;

// 自动启动：根目录（中文）
startLoadingProducts('');

console.log('=== 产品加载脚本初始化完成 ===');
