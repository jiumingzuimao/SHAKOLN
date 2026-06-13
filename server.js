const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/hot-products', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'hot_products.json');
        const data = fs.readFileSync(filePath, 'utf8');
        res.json({ success: true, data: JSON.parse(data) });
    } catch (error) {
        console.error('读取 hot_products.json 失败:', error);
        res.status(500).json({ success: false, message: '读取数据失败' });
    }
});

app.post('/api/hot-products', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'hot_products.json');
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: '保存成功' });
    } catch (error) {
        console.error('保存 hot_products.json 失败:', error);
        res.status(500).json({ success: false, message: '保存数据失败' });
    }
});

app.get('/api/home-products', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'home_products.json');
        const data = fs.readFileSync(filePath, 'utf8');
        res.json({ success: true, data: JSON.parse(data) });
    } catch (error) {
        console.error('读取 home_products.json 失败:', error);
        res.status(500).json({ success: false, message: '读取数据失败' });
    }
});

app.post('/api/home-products', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'home_products.json');
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: '保存成功' });
    } catch (error) {
        console.error('保存 home_products.json 失败:', error);
        res.status(500).json({ success: false, message: '保存数据失败' });
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('API 端点:');
    console.log('  GET  /api/hot-products  - 获取爆款推荐');
    console.log('  POST /api/hot-products  - 保存爆款推荐');
    console.log('  GET  /api/home-products - 获取产品中心');
    console.log('  POST /api/home-products - 保存产品中心');
});
