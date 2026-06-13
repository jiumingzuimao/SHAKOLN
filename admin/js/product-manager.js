// 产品数据管理
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
    }
    
    // 加载产品数据
    loadProducts() {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    }
    
    // 保存产品数据
    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }
    
    // 添加产品
    addProduct(product) {
        const newProduct = {
            id: Date.now().toString(),
            name: product.name,
            oe: product.oe,
            category: product.category,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            description: product.description,
            image: product.image || '',
            status: product.status,
            createdAt: new Date().toISOString()
        };
        
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }
    
    // 获取所有产品
    getProducts() {
        return this.products;
    }
    
    // 根据ID获取产品
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
    
    // 更新产品
    updateProduct(id, productData) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
            this.saveProducts();
            return this.products[index];
        }
        return null;
    }
    
    // 删除产品
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return true;
        }
        return false;
    }
    
    // 搜索产品
    searchProducts(keyword) {
        if (!keyword) return this.products;
        
        const lowerKeyword = keyword.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowerKeyword) ||
            product.oe.toLowerCase().includes(lowerKeyword) ||
            product.description.toLowerCase().includes(lowerKeyword)
        );
    }
    
    // 按分类筛选产品
    filterByCategory(category) {
        if (!category) return this.products;
        return this.products.filter(product => product.category === category);
    }
}

// 导出ProductManager实例
const productManager = new ProductManager();

// 为了在浏览器中使用
if (typeof window !== 'undefined') {
    window.ProductManager = ProductManager;
    window.productManager = productManager;
}