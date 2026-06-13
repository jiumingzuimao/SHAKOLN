// 本地存储管理模块
class StorageManager {
    constructor() {
        this.prefix = 'shakoln_';
    }
    
    // 存储数据
    set(key, value) {
        try {
            const storageKey = this.prefix + key;
            const storageValue = JSON.stringify(value);
            console.log(`[StorageManager] 存储数据 - key: ${storageKey}, value:`, value);
            localStorage.setItem(storageKey, storageValue);
            console.log(`[StorageManager] 数据存储成功！`);
            return true;
        } catch (error) {
            console.error('存储数据失败:', error);
            return false;
        }
    }
    
    // 获取数据
    get(key) {
        try {
            const storageKey = this.prefix + key;
            const storageValue = localStorage.getItem(storageKey);
            console.log(`[StorageManager] 获取数据 - key: ${storageKey}, value:`, storageValue);
            return storageValue ? JSON.parse(storageValue) : null;
        } catch (error) {
            console.error('获取数据失败:', error);
            return null;
        }
    }
    
    // 删除数据
    remove(key) {
        try {
            const storageKey = this.prefix + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }
    
    // 清空所有数据
    clear() {
        try {
            // 只清空以shakoln_开头的数据
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            }
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    }
    
    // 存储产品数据
    setProducts(products) {
        return this.set('products', products);
    }
    
    // 获取产品数据
    getProducts() {
        return this.get('products') || [];
    }
    
    // 存储Excel数据
    setExcelData(data) {
        return this.set('excel_data', data);
    }
    
    // 获取Excel数据
    getExcelData() {
        return this.get('excel_data') || [];
    }
    
    // 存储分类数据
    setCategories(categories) {
        return this.set('categories', categories);
    }
    
    // 获取分类数据
    getCategories() {
        return this.get('categories') || [];
    }
    
    // 存储车型数据
    setCarModels(models) {
        return this.set('car_models', models);
    }
    
    // 获取车型数据
    getCarModels() {
        return this.get('car_models') || [];
    }
    
    // 根据OE号获取产品
    getProductByOE(oe) {
        const products = this.getProducts();
        return products.find(product => product.oe === oe);
    }
    
    // 根据车型/底盘获取产品
    getProductsByChassis(brand, model, chassis) {
        const products = this.getProducts();
        return products.filter(product => {
            return product.brand === brand && 
                   product.model === model && 
                   product.chassis === chassis;
        });
    }
    
    // 搜索产品
    searchProducts(keyword) {
        const products = this.getProducts();
        return products.filter(product => {
            const searchStr = `${product.oe} ${product.name} ${product.brand} ${product.model}`.toLowerCase();
            return searchStr.includes(keyword.toLowerCase());
        });
    }

    // 存储报价数据
    setQuotes(quotes) {
        return this.set('quotes', quotes);
    }

    // 获取报价数据
    getQuotes() {
        return this.get('quotes') || [];
    }

    // 添加报价
    addQuote(quote) {
        console.log('[StorageManager] 开始添加报价:', quote);
        const quotes = this.getQuotes();
        console.log('[StorageManager] 当前报价列表:', quotes);
        quote.id = Date.now().toString();
        quote.createdAt = new Date().toISOString();
        quote.status = 'pending';
        quotes.unshift(quote);
        console.log('[StorageManager] 添加后的报价列表:', quotes);
        const result = this.setQuotes(quotes);
        console.log('[StorageManager] 保存结果:', result);
        return result;
    }

    // 更新报价状态
    updateQuoteStatus(id, status) {
        const quotes = this.getQuotes();
        const quoteIndex = quotes.findIndex(q => q.id === id);
        if (quoteIndex !== -1) {
            quotes[quoteIndex].status = status;
            quotes[quoteIndex].updatedAt = new Date().toISOString();
            return this.setQuotes(quotes);
        }
        return false;
    }

    // 删除报价
    deleteQuote(id) {
        const quotes = this.getQuotes();
        const filteredQuotes = quotes.filter(q => q.id !== id);
        return this.setQuotes(filteredQuotes);
    }
}

// 导出单例实例
const storageManager = new StorageManager();

// 如果在浏览器环境中
try {
    if (typeof window !== 'undefined') {
        window.StorageManager = StorageManager;
        window.storageManager = storageManager;
    }
} catch (e) {
    // 非浏览器环境，忽略
}