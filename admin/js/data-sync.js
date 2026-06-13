// 数据同步模块
class DataSync {
    constructor() {
        this.storage = window.storageManager || new StorageManager();
    }
    
    // 初始化数据
    initData() {
        // 检查是否已有数据
        if (this.storage.getProducts().length === 0) {
            this.importInitialData();
        }
    }
    
    // 导入初始数据
    importInitialData() {
        // 模拟初始产品数据
        const initialProducts = [
            {
                id: '1',
                oe: '11427512840',
                name: '机油滤清器',
                brand: '奔驰',
                model: 'C级',
                chassis: 'W205',
                series: 'C180 C200 C260',
                category: '发动机系统',
                price: 120,
                stock: 100,
                description: '适用于奔驰C级W205车型的机油滤清器',
                status: '上架'
            },
            {
                id: '2',
                oe: '13717580029',
                name: '空气滤清器',
                brand: '奔驰',
                model: 'E级',
                chassis: 'W213',
                series: 'E200 E260 E300',
                category: '发动机系统',
                price: 150,
                stock: 80,
                description: '适用于奔驰E级W213车型的空气滤清器',
                status: '上架'
            },
            {
                id: '3',
                oe: '12120037898',
                name: '火花塞',
                brand: '宝马',
                model: '3系',
                chassis: 'F30',
                series: '318i 320i 328i',
                category: '发动机系统',
                price: 80,
                stock: 150,
                description: '适用于宝马3系F30车型的火花塞',
                status: '上架'
            },
            {
                id: '4',
                oe: '2722001601',
                name: '水管',
                brand: '奔驰',
                model: 'E级',
                chassis: 'W212',
                series: 'E200 E260 E300',
                category: '冷却系统',
                price: 200,
                stock: 60,
                description: '适用于奔驰E级W212车型的水管',
                status: '上架'
            },
            {
                id: '5',
                oe: '2033300051',
                name: '轴头',
                brand: '奔驰',
                model: 'C级',
                chassis: 'W204',
                series: 'C180 C200 C260',
                category: '底盘系统',
                price: 300,
                stock: 40,
                description: '适用于奔驰C级W204车型的轴头',
                status: '上架'
            }
        ];
        
        // 存储初始数据
        this.storage.setProducts(initialProducts);
        
        // 存储分类数据
        const categories = [
            { id: '1', name: '发动机系统', description: '包括机油滤清器、空气滤清器、火花塞等' },
            { id: '2', name: '冷却系统', description: '包括水管、水箱、水泵等' },
            { id: '3', name: '底盘系统', description: '包括轴头、悬挂、刹车等' },
            { id: '4', name: '电气系统', description: '包括传感器、继电器、保险丝等' }
        ];
        this.storage.setCategories(categories);
        
        // 存储车型数据
        const carModels = [
            { id: '1', brand: '奔驰', model: 'C级', chassis: 'W205', years: '2014-2020' },
            { id: '2', brand: '奔驰', model: 'E级', chassis: 'W213', years: '2016-2023' },
            { id: '3', brand: '宝马', model: '3系', chassis: 'F30', years: '2012-2019' }
        ];
        this.storage.setCarModels(carModels);
        
        console.log('初始数据导入完成');
    }
    
    // 同步产品数据到前台
    syncProductsToFrontend() {
        const products = this.storage.getProducts();
        return products;
    }
    
    // 从前台获取产品数据
    syncProductsFromFrontend() {
        const products = this.storage.getProducts();
        return products;
    }
    
    // 同步分类数据
    syncCategories() {
        return this.storage.getCategories();
    }
    
    // 同步车型数据
    syncCarModels() {
        return this.storage.getCarModels();
    }
    
    // 搜索产品
    searchProducts(keyword) {
        return this.storage.searchProducts(keyword);
    }
    
    // 根据OE号获取产品
    getProductByOE(oe) {
        return this.storage.getProductByOE(oe);
    }
    
    // 根据车型/底盘获取产品
    getProductsByChassis(brand, model, chassis) {
        return this.storage.getProductsByChassis(brand, model, chassis);
    }
    
    // 添加产品
    addProduct(product) {
        const products = this.storage.getProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...product
        };
        products.push(newProduct);
        this.storage.setProducts(products);
        return newProduct;
    }
    
    // 更新产品
    updateProduct(id, product) {
        const products = this.storage.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...product };
            this.storage.setProducts(products);
            return true;
        }
        return false;
    }
    
    // 删除产品
    deleteProduct(id) {
        const products = this.storage.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        if (filteredProducts.length !== products.length) {
            this.storage.setProducts(filteredProducts);
            return true;
        }
        return false;
    }
}

// 导出单例实例
const dataSync = new DataSync();

// 如果在浏览器环境中
try {
    if (typeof window !== 'undefined') {
        window.DataSync = DataSync;
        window.dataSync = dataSync;
    }
} catch (e) {
    // 非浏览器环境，忽略
}