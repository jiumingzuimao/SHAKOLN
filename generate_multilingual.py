#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
import shutil
from pathlib import Path

# 翻译字典 - 英文、俄文、阿拉伯文
translations = {
    'en': {
        # 导航和通用
        '首页': 'Home',
        '产品中心': 'Products',
        '车型查询': 'Car Models',
        '车型大全': 'Car Models',
        '实力工厂': 'Factory',
        '服务中心': 'Services',
        '新闻资讯': 'News',
        '常见问题': 'FAQ',
        '联系我们': 'Contact Us',
        '关于我们': 'About Us',
        '关于萨肯': 'About Us',
        '公司简介': 'Company Profile',
        '企业文化': 'Corporate Culture',
        '发展历程': 'History',
        '荣誉资质': 'Honors',
        '团队介绍': 'Team',
        '现货库存': 'Stock',
        '微信客服': 'WeChat Service',
        
        # 标题
        '公司信息': 'Company Info',
        '快速链接': 'Quick Links',
        '服务承诺': 'Service Promise',
        '联系方式': 'Contact',
        
        # 首页
        '萨肯汽配': 'Saken Auto Parts',
        '专业汽车配件': 'Professional Auto Parts',
        '官网': 'Official Website',
        'OE Number Search': 'OE Number Search',
        'OE号查询': 'OE Number Search',
        '请输入OE号': 'Enter OE Number',
        '查询': 'Search',
        '四大优势': 'Four Advantages',
        '品牌优势': 'Brand Advantage',
        '品质保证': 'Quality Assurance',
        '服务优势': 'Service Advantage',
        '价格优势': 'Price Advantage',
        '专业服务': 'Professional Service',
        '全国配送': 'Nationwide Delivery',
        '畅销车型': 'Hot Models',
        '查看配件': 'View Parts',
        '查看详情': 'View Details',
        '爆款推荐': 'Hot Products',
        '库存：': 'Stock: ',
        '三大服务': 'Three Services',
        '技术支持': 'Technical Support',
        '售后保障': 'After-sales',
        '配送服务': 'Delivery',
        '了解更多': 'Learn More',
        '车型查找': 'Car Search',
        '在线报价': 'Quote Online',
        '底盘': 'Chassis',
        '配件': 'Parts',
        
        # 公司信息
        '北京云孚汽车贸易有限公司': 'Beijing Yunfu Automobile Trade Co., Ltd.',
        '公司名称：': 'Company: ',
        '公司地址：北京市朝阳区小红门 69 号': 'Address: No. 69 Xiaohongmen, Chaoyang District, Beijing',
        '服务热线：400 626 0128': 'Hotline: 400 626 0128',
        '微信客服：sakenqp123': 'WeChat: sakenqp123',
        '邮箱：shakoln@163.com': 'Email: shakoln@163.com',
        '正品保证': 'Genuine Guarantee',
        '现货供应': 'In Stock',
        '快速配送': 'Fast Delivery',
        '售后保障': 'After-sales',
        
        # 产品相关
        '机油滤清器': 'Oil Filter',
        '空气滤清器': 'Air Filter',
        '燃油滤清器': 'Fuel Filter',
        '空调滤清器': 'Cabin Filter',
        '火花塞': 'Spark Plug',
        '刹车片': 'Brake Pad',
        '刹车盘': 'Brake Disc',
        '水泵': 'Water Pump',
        '奔驰': 'Mercedes-Benz',
        '宝马': 'BMW',
        '奥迪': 'Audi',
        '现货': 'In Stock',
        '库存紧张': 'Low Stock',
        '品牌：': 'Brand: ',
        '车型：': 'Model: ',
        'OE号：': 'OE No.: ',
        '配件名称：': 'Part Name: ',
        
        # 车型
        '奔驰C级': 'Mercedes-Benz C-Class',
        '豪华轿车': 'Luxury Sedan',
        '宝马3系': 'BMW 3 Series',
        '奔驰E级': 'Mercedes-Benz E-Class',
        '奔驰S级': 'Mercedes-Benz S-Class',
        '宝马5系': 'BMW 5 Series',
        '宝马7系': 'BMW 7 Series',
        '宝马X3': 'BMW X3',
        '奔驰GLC': 'Mercedes-Benz GLC',
        
        # 其他
        '查询条件：': 'Search: ',
        '库存查询': 'Stock Search',
        '配件名称': 'Part Name',
        '品牌': 'Brand',
        '全部品牌': 'All Brands',
        '库存列表': 'Stock List',
        '库存数量': 'Quantity',
        '状态': 'Status',
        '操作': 'Action',
        '查询库存': 'Search Stock',
        '抱歉，您查询的产品不存在或已下架': 'Sorry, the product you are looking for does not exist or has been removed.',
        '返回首页': 'Back to Home',
        '产品描述': 'Description',
        '本产品为萨肯汽配高品质汽车配件，采用优质材料制造，具有良好的性能和使用寿命，确保您的车辆正常运行。': 'This is a high-quality auto part from Saken Auto Parts, made with premium materials for excellent performance and durability, ensuring your vehicle runs smoothly.',
        '加载中...': 'Loading...',
        '产品不存在': 'Product Not Found',
        '加载失败': 'Loading Failed',
        '参数错误，请提供有效的OE号': 'Invalid parameter, please provide a valid OE number',
        
        # 服务相关
        '咨询服务': 'Consulting',
        '安装指导': 'Installation Guide',
        '产品质保': 'Warranty',
        '售后支持': 'After-sales Support',
        '物流配送': 'Logistics',
        '培训服务': 'Training',
        
        # 工厂相关
        '实力工厂': 'Factory',
        '生产设备': 'Equipment',
        '生产流程': 'Process',
        '品质控制': 'Quality Control',
        '企业文化': 'Culture',
        '企业荣誉': 'Honors',
        
        # 新闻相关
        '新闻资讯': 'News',
        '企业新闻': 'Company News',
        '行业动态': 'Industry News',
        '阅读全文': 'Read More',
        
        # FAQ
        '常见问题': 'FAQ',
        '更多问题': 'More Questions',
        
        # 联系我们
        '联系方式': 'Contact',
        '在线留言': 'Message',
        '留言反馈': 'Feedback',
        '您的姓名': 'Your Name',
        '联系电话': 'Phone',
        '电子邮箱': 'Email',
        '留言内容': 'Message',
        '提交留言': 'Submit',
        
        # 版权
        '©2025 北京云孚汽车贸易有限公司': '©2025 Beijing Yunfu Automobile Trade Co., Ltd.',
        
        # 首页车型查询部分
        '配件适配查询': 'Parts Fitment Search',
        'VIN车架号查询': 'VIN Search',
        '底盘号查询': 'Chassis Search',
        '车型选择查询': 'Model Selection Search',
        'VIN车架号': 'VIN Number',
        '请输入17位VIN车架号（如LBV5S310XMSXXXXXX）': 'Enter 17-digit VIN (e.g. LBV5S310XMSXXXXXX)',
        '查询适配配件': 'Search Compatible Parts',
        '底盘号': 'Chassis Number',
        '请输入底盘号（如F18、W222、G38）': 'Enter chassis number (e.g. F18, W222, G38)',
        '请选择品牌': 'Select Brand',
        '奔驰 BENZ': 'Mercedes-Benz',
        '宝马 BMW': 'BMW',
        '车系': 'Series',
        '请先选择品牌': 'Please select brand first',
        '车型': 'Model',
        '请先选择车系': 'Please select series first',
        '年款': 'Year',
        '请选择年款': 'Select Year',
        '查询结果': 'Search Results',
        '配件分类': 'Category',
        '配件名称': 'Part Name',
        'OE编号': 'OE Number',
        '萨肯编号': 'Saken No.',
        '适配状态': 'Compatibility Status',
        '操作': 'Action',
        
        # 三大服务
        '在线报价': 'Online Quote',
        '专业客服团队，快速响应报价需求': 'Professional customer service team, quick quote response',
        '现货库存': 'In Stock',
        '海量库存，大部分配件当天发货': 'Huge inventory, most parts ship same day',
        '售后保障': 'After-sales Support',
        '7天无理由退换，1年质保服务': '7-day no-question return, 1-year warranty service',
        '配件列表': 'Parts List',
        
        # 工厂简介
        '北京云孚汽车贸易有限公司成立于2010年，是专业的奔驰/宝马汽车配件供应商。': 'Beijing Yunfu Automobile Trade Co., Ltd. was founded in 2010 and is a professional Mercedes-Benz/BMW auto parts supplier.',
        '工厂配备了先进的生产设备和检测仪器，拥有一支经验丰富的技术团队，致力于为客户提供高品质的汽车配件。我们的产品涵盖发动机、变速箱、悬挂、制动等多个系统，满足不同客户的需求。': 'Factory equipped with advanced production equipment and testing instruments, has an experienced technical team, committed to providing high-quality auto parts. Our products cover engine, transmission, suspension, braking and other systems to meet different customer needs.',
        '公司秉承"品质第一、客户至上"的经营理念，通过了ISO9001质量管理体系认证，产品远销全国各地，深受客户信赖。': 'Company adheres to the "Quality First, Customer First" philosophy, ISO9001 quality management system certified, products sold nationwide, trusted by customers.',
        '萨肯汽配工厂': 'Saken Auto Parts Factory',
        
        # 车型选择
        '请选择车型': 'Select Model',
        '标准版': 'Standard',
        '豪华版': 'Luxury',
        '运动版': 'Sport',
        'C级': 'C-Class',
        'E级': 'E-Class',
        'S级': 'S-Class',
        'GLC': 'GLC',
        'GLE': 'GLE',
        'GLB': 'GLB',
        '3系': '3 Series',
        '5系': '5 Series',
        '7系': '7 Series',
        'X3': 'X3',
        'X5': 'X5',
        'X7': 'X7',
        
        # 其他界面文本
        '品牌': 'Brand',
        'VIN码': 'VIN',
        '年份': 'Year',
        '完全适配': 'Perfect Match',
        '暂无适配该车型的配件数据': 'No compatible parts data for this vehicle',
        '库存:': 'Stock:',
        '件': 'pcs',
        '请输入VIN车架号': 'Please enter VIN number',
        'VIN车架号必须是17位字符': 'VIN must be 17 characters',
        '请输入底盘号': 'Please enter chassis number',
        '请填写完整查询信息': 'Please fill in complete search info',
        '警告：无法从VIN码识别品牌，请检查VIN码是否正确': 'Warning: Cannot identify brand from VIN, please check if VIN is correct',
        '提示：无法从VIN码推断底盘号，将按品牌查询配件': 'Hint: Cannot infer chassis number from VIN, will search parts by brand',
        
        # 产品页面文本
        '输入配件名、OE号或型号': 'Enter part name, OE number or model',
        '搜索': 'Search',
        '热门配件': 'Popular Parts',
        '气门室盖': 'Valve Cover',
        '减震器': 'Shock Absorber',
        '摆臂': 'Control Arm',
        'Water Pump': 'Water Pump',
        '刷新': 'Refresh',
        '刷新数据和图片': 'Refresh data and images',
        '全部配件': 'All Parts',
        '全部系列': 'All Series',
        '共找到': 'Found',
        '产品': 'Products',
        '排序': 'Sort',
        '综合': 'Comprehensive',
        '前台序号': 'Display Order',
        '价格从低到高': 'Price: Low to High',
        '价格从高到低': 'Price: High to Low',
        '销量优先': 'Sales Priority',
        
        # 产品列表文本
        'Loading Failed': 'Loading Failed',
        '数据加载失败，请稍后重试': 'Data loading failed, please try again later',
        '机油滤清器': 'Oil Filter',
        '空气滤清器': 'Air Filter',
        '燃油滤清器': 'Fuel Filter',
        '火花塞': 'Spark Plug',
        '刹车片': 'Brake Pad',
        # 新闻页面
        '首页': 'Home',
        '新闻资讯': 'News',
        '了解萨肯汽配的最新动态和行业资讯': 'Learn about the latest developments and industry news of Saken Auto Parts',
        '新闻分类': 'News Categories',
        '全部新闻': 'All News',
        '公司动态': 'Company News',
        '产品信息': 'Product Info',
        '技术分享': 'Tech Share',
        '展会信息': 'Exhibition Info',
        '搜索新闻...': 'Search News...',
        '最新新闻': 'Latest News',
        '萨肯汽配参加2024年广州国际汽车零部件展览会': 'Saken Auto Parts Participates in 2024 Guangzhou International Auto Parts Exhibition',
        '萨肯汽配推出全新奔驰系列配件': 'Saken Auto Parts Launches New Mercedes-Benz Series Parts',
        '萨肯汽配获得ISO9001质量管理体系认证': 'Saken Auto Parts Obtains ISO9001 Quality Management System Certification',
        '萨肯汽配与多家4S店达成合作': 'Saken Auto Parts Reaches Cooperation with Multiple 4S Stores',
        '萨肯汽配工厂扩建项目启动': 'Saken Auto Parts Factory Expansion Project Launched',
        '浏览量': 'Views',
        '展会图片': 'Exhibition Image',
        '产品图片': 'Product Image',
        '认证图片': 'Certification Image',
        '合作图片': 'Cooperation Image',
        '萨肯汽配将于2024年4月10日至12日参加在广州举办的国际汽车零部件展览会，展示最新的奔驰宝马配件产品。届时，我们将在展会现场设置专业展台，展示公司的核心产品和技术优势，欢迎广大客户前来参观洽谈。': 'Saken Auto Parts will participate in the Guangzhou International Auto Parts Exhibition from April 10 to 12, 2024, showcasing the latest Mercedes-Benz and BMW parts products. We will set up a professional booth at the exhibition site to display the company\'s core products and technical advantages. Welcome customers to visit and discuss.',
        '萨肯汽配近日推出全新奔驰系列配件，包括发动机、底盘、电器和车身等多个系列的产品。这些产品采用优质材料和先进工艺制造，严格按照原厂标准生产，确保与原车完美匹配。新系列产品已开始接受订单，欢迎广大客户咨询采购。': 'Saken Auto Parts recently launched a new Mercedes-Benz series of parts, including engine, chassis, electrical and body products. These products are made of high-quality materials and advanced processes, strictly manufactured according to original factory standards to ensure perfect matching with the original vehicle. The new series of products have started to accept orders, welcome customers to inquire and purchase.',
        '萨肯汽配近日成功获得ISO9001质量管理体系认证，这标志着公司的质量管理水平达到了国际标准。通过认证，公司将进一步加强质量管理，提高产品质量和服务水平，为客户提供更加可靠的产品和服务。': 'Saken Auto Parts recently successfully obtained ISO9001 quality management system certification, which marks that the company\'s quality management level has reached international standards. Through certification, the company will further strengthen quality management, improve product quality and service levels, and provide customers with more reliable products and services.',
        '萨肯汽配近日与多家奔驰宝马4S店达成合作协议，成为其指定的配件供应商。这一合作将进一步扩大公司的市场份额，提高品牌知名度。同时，公司将为4S店提供更加专业的技术支持和售后服务，共同为客户提供优质的服务体验。': 'Saken Auto Parts recently reached cooperation agreements with multiple Mercedes-Benz and BMW 4S stores, becoming their designated parts supplier. This cooperation will further expand the company\'s market share and increase brand awareness. At the same time, the company will provide more professional technical support and after-sales service to 4S stores, working together to provide customers with a quality service experience.',
        '阅读更多 →': 'Read More →',
        # 分页
        '上一页': 'Previous',
        '下一页': 'Next',
        '跳转': 'Go',
        '页': 'Page',
        # FAQ页面
        '常见问题': 'FAQ',
        '查看答案': 'View Answer',
        # 联系我们页面
        '联系我们': 'Contact Us',
        '联系方式': 'Contact Info',
        '在线留言': 'Online Message',
        '留言反馈': 'Feedback',
        '您的姓名': 'Your Name',
        '联系电话': 'Phone',
        '电子邮箱': 'Email',
        '留言内容': 'Message',
        '提交留言': 'Submit',
        # 工厂页面
        '实力工厂': 'Factory',
        '生产设备': 'Equipment',
        '生产流程': 'Process',
        '品质控制': 'Quality Control',
        '企业文化': 'Culture',
        '企业荣誉': 'Honors',
        # 服务页面
        '服务中心': 'Services',
        '咨询服务': 'Consulting',
        '安装指导': 'Installation',
        '产品质保': 'Warranty',
        '售后支持': 'Support',
        '物流配送': 'Delivery',
        '培训服务': 'Training',
        '专业服务': 'Professional Service',
        '全国配送': 'Nationwide Delivery',
        '在线报价': 'Online Quote',
        '专业客服团队，快速响应报价需求': 'Professional customer service team, quick quote response',
        '海量库存，大部分配件当天发货': 'Huge inventory, most parts ship same day',
        '售后保障': 'After-sales',
        # 关于我们页面
        '关于我们': 'About Us',
        '关于萨肯': 'About Saken',
        '公司简介': 'Company Profile',
        '公司信息': 'Company Info',
        '快速链接': 'Quick Links',
        '服务承诺': 'Service Promise',
        '北京云孚汽车贸易有限公司': 'Beijing Yunfu Automobile Trade Co., Ltd.',
        '公司地址：北京市朝阳区小红门 69 号': 'Address: No. 69 Xiaohongmen, Chaoyang District, Beijing',
        '服务热线：400 626 0128': 'Hotline: 400 626 0128',
        '微信客服：sakenqp123': 'WeChat: sakenqp123',
        '邮箱：shakoln@163.com': 'Email: shakoln@163.com',
        '正品保证': 'Genuine Guarantee',
        '现货供应': 'In Stock',
        '快速配送': 'Fast Delivery',
        # 面包屑导航
        '车型大全': 'Car Models',
        '实力工厂': 'Factory',
        '常见问题': 'FAQ',
        # 车型页面
        '热门车型': 'Hot Models',
        '查看配件': 'View Parts',
        '查看详情': 'View Details',
        '奔驰C级': 'Mercedes-Benz C-Class',
        '豪华轿车': 'Luxury Sedan',
        '宝马3系': 'BMW 3 Series',
        '奔驰E级': 'Mercedes-Benz E-Class',
        '奔驰S级': 'Mercedes-Benz S-Class',
        '宝马5系': 'BMW 5 Series',
        '宝马7系': 'BMW 7 Series',
        '宝马X3': 'BMW X3',
        '奔驰GLC': 'Mercedes-Benz GLC',
        # 搜索相关
        '搜索': 'Search',
        '输入配件名、OE号或型号': 'Enter part name, OE number or model',
        '热门配件': 'Popular Parts',
        '气门室盖': 'Valve Cover',
        '减震器': 'Shock Absorber',
        '摆臂': 'Control Arm',
        '水泵': 'Water Pump',
        '刷新': 'Refresh',
        '刷新数据和图片': 'Refresh data and images',
        '全部配件': 'All Parts',
        '全部系列': 'All Series',
        '共找到': 'Found',
        '件产品': 'products',
        '排序': 'Sort',
        '综合': 'Comprehensive',
        '前台序号': 'Display Order',
        '价格从低到高': 'Price: Low to High',
        '价格从高到低': 'Price: High to Low',
        '销量优先': 'Sales Priority',
        # 产品详情页面
        '产品详情': 'Product Details',
        '库存:': 'Stock:',
        '件': 'pcs',
        '品牌:': 'Brand:',
        '车型:': 'Model:',
        'OE号:': 'OE No.:',
        '配件名称:': 'Part Name:',
        '产品描述': 'Description',
        '本产品为萨肯汽配高品质汽车配件，采用优质材料制造，具有良好的性能和使用寿命，确保您的车辆正常运行。': 'This is a high-quality auto part from Saken Auto Parts, made with premium materials for excellent performance and durability, ensuring your vehicle runs smoothly.',
        '产品不存在': 'Product Not Found',
        '抱歉，您查询的产品不存在或已下架': 'Sorry, the product you are looking for does not exist or has been removed.',
        '返回首页': 'Back to Home',
        # 加载相关
        '加载中...': 'Loading...',
        '加载失败': 'Loading Failed',
        '参数错误，请提供有效的OE号': 'Invalid parameter, please provide a valid OE number',
        # 其他
        '萨肯汽配': 'Saken Auto Parts',
        '专业汽车配件': 'Professional Auto Parts',
        '官网': 'Official Website',
        '微信客服': 'WeChat Service',
        '现货库存': 'In Stock'
    },
    
    'ru': {
        # 导航和通用
        '首页': 'Главная',
        '产品中心': 'Товары',
        '车型查询': 'Модели авто',
        '车型大全': 'Модели авто',
        '实力工厂': 'Завод',
        '服务中心': 'Услуги',
        '新闻资讯': 'Новости',
        '常见问题': 'FAQ',
        '联系我们': 'Контакты',
        '关于我们': 'О нас',
        '关于萨肯': 'О нас',
        '公司简介': 'О компании',
        '企业文化': 'Корпоративная культура',
        '发展历程': 'История',
        '荣誉资质': 'Награды',
        '团队介绍': 'Команда',
        '现货库存': 'Склад',
        '微信客服': 'WeChat Поддержка',
        
        # 标题
        '公司信息': 'Информация',
        '快速链接': 'Быстрые ссылки',
        '服务承诺': 'Гарантии',
        '联系方式': 'Контакты',
        
        # 首页
        'OE号查询': 'Поиск по OE',
        '请输入OE号': 'Введите OE номер',
        '查询': 'Поиск',
        '四大优势': 'Четыре преимущества',
        '品牌优势': 'Преимущество бренда',
        '品质保证': 'Гарантия качества',
        '服务优势': 'Преимущество сервиса',
        '价格优势': 'Ценовое преимущество',
        '畅销车型': 'Популярные модели',
        '查看配件': 'Посмотреть запчасти',
        '查看详情': 'Подробнее',
        '爆款推荐': 'Хиты продаж',
        '库存：': 'На складе: ',
        '三大服务': 'Три услуги',
        '技术支持': 'Техподдержка',
        '售后保障': 'Гарантия',
        '配送服务': 'Доставка',
        '了解更多': 'Узнать больше',
        '车型查找': 'Поиск модели',
        '在线报价': 'Онлайн расчет',
        
        # 公司信息
        '北京云孚汽车贸易有限公司': 'Beijing Yunfu Automobile Trade Co., Ltd.',
        '公司名称：': 'Компания: ',
        '公司地址：北京市朝阳区小红门 69 号': 'Адрес: №69 Xiaohongmen, район Chaoyang, Пекин',
        '服务热线：400 626 0128': 'Телефон: 400 626 0128',
        '微信客服：sakenqp123': 'WeChat: sakenqp123',
        '邮箱：shakoln@163.com': 'Email: shakoln@163.com',
        '正品保证': 'Оригинал',
        '现货供应': 'В наличии',
        '快速配送': 'Быстрая доставка',
        '售后保障': 'Гарантия',
        
        # 产品相关
        '机油滤清器': 'Масляный фильтр',
        '空气滤清器': 'Воздушный фильтр',
        '燃油滤清器': 'Топливный фильтр',
        '空调滤清器': 'Фильтр салона',
        '火花塞': 'Свеча зажигания',
        '刹车片': 'Тормозные колодки',
        '刹车盘': 'Тормозной диск',
        '水泵': 'Водяной насос',
        '奔驰': 'Mercedes-Benz',
        '宝马': 'BMW',
        '奥迪': 'Audi',
        '现货': 'В наличии',
        '库存紧张': 'Мало на складе',
        '品牌：': 'Бренд: ',
        '车型：': 'Модель: ',
        'OE号：': 'OE №: ',
        '配件名称：': 'Название: ',
        
        # 车型
        '奔驰C级': 'Mercedes-Benz C-Класс',
        '豪华轿车': 'Люкс седан',
        '宝马3系': 'BMW 3 серии',
        '奔驰E级': 'Mercedes-Benz E-Класс',
        '奔驰S级': 'Mercedes-Benz S-Класс',
        '宝马5系': 'BMW 5 серии',
        '宝马7系': 'BMW 7 серии',
        '宝马X3': 'BMW X3',
        '奔驰GLC': 'Mercedes-Benz GLC',
        
        # 其他
        '查询条件：': 'Поиск: ',
        '库存查询': 'Поиск на складе',
        '配件名称': 'Название запчасти',
        '品牌': 'Бренд',
        '全部品牌': 'Все бренды',
        '库存列表': 'Список',
        '库存数量': 'Количество',
        '状态': 'Статус',
        '操作': 'Действие',
        '查询库存': 'Поиск',
        '抱歉，您查询的产品不存在或已下架': 'Извините, товар не найден или снят с производства.',
        '返回首页': 'На главную',
        '产品描述': 'Описание',
        '本产品为萨肯汽配高品质汽车配件，采用优质材料制造，具有良好的性能和使用寿命，确保您的车辆正常运行。': 'Это высококачественная автозапчасть от Saken Auto Parts, изготовленная из премиум материалов для отличной производительности и долговечности, обеспечивающая бесперебойную работу вашего автомобиля.',
        '加载中...': 'Загрузка...',
        '产品不存在': 'Товар не найден',
        '加载失败': 'Ошибка загрузки',
        '参数错误，请提供有效的OE号': 'Неверный параметр, введите действительный OE номер',
        
        # 服务相关
        '咨询服务': 'Консультации',
        '安装指导': 'Установка',
        '产品质保': 'Гарантия',
        '售后支持': 'Поддержка',
        '物流配送': 'Доставка',
        '培训服务': 'Обучение',
        
        # 工厂相关
        '实力工厂': 'Завод',
        '生产设备': 'Оборудование',
        '生产流程': 'Процесс',
        '品质控制': 'Контроль качества',
        '企业文化': 'Культура',
        '企业荣誉': 'Награды',
        
        # 新闻相关
        '新闻资讯': 'Новости',
        '企业新闻': 'Новости компании',
        '行业动态': 'Новости отрасли',
        '阅读全文': 'Читать далее',
        
        # FAQ
        '常见问题': 'FAQ',
        '更多问题': 'Ещё вопросы',
        
        # 联系我们
        '联系方式': 'Контакты',
        '在线留言': 'Сообщение',
        '留言反馈': 'Отзыв',
        '您的姓名': 'Ваше имя',
        '联系电话': 'Телефон',
        '电子邮箱': 'Email',
        '留言内容': 'Сообщение',
        '提交留言': 'Отправить',
        
        # 版权
        '©2025 北京云孚汽车贸易有限公司': '©2025 Beijing Yunfu Automobile Trade Co., Ltd.',
        
        # 产品页面文本
        '输入配件名、OE号或型号': 'Введите название запчасти, OE номер или модель',
        '搜索': 'Поиск',
        '热门配件': 'Популярные запчасти',
        '气门室盖': 'Крышка клапанной камеры',
        '减震器': 'Амортизатор',
        '摆臂': 'Рычаг подвески',
        'Water Pump': 'Водяной насос',
        '水泵': 'Водяной насос',
        '刷新': 'Обновить',
        '刷新数据和图片': 'Обновить данные и изображения',
        '全部配件': 'Все запчасти',
        '全部系列': 'Все серии',
        '共找到': 'Найдено',
        '件产品': 'товаров',
        '排序': 'Сортировать',
        '综合': 'Комплексно',
        '前台序号': 'Порядок отображения',
        '价格从低到高': 'Цена: от низкой к высокой',
        '价格从高到低': 'Цена: от высокой к низкой',
        '销量优先': 'По продажам',
        
        # 产品列表文本
        'Loading Failed': 'Ошибка загрузки',
        '数据加载失败，请稍后重试': 'Ошибка загрузки данных, попробуйте позже',
        '机油滤清器': 'Масляный фильтр',
        '空气滤清器': 'Воздушный фильтр',
        '燃油滤清器': 'Топливный фильтр',
        '火花塞': 'Свеча зажигания',
        '刹车片': 'Тормозные колодки',
        # 新闻页面
        '首页': 'Главная',
        '新闻资讯': 'Новости',
        '了解萨肯汽配的最新动态和行业资讯': 'Узнайте о последних разработках и отраслевых новостях Saken Auto Parts',
        '新闻分类': 'Категории новостей',
        '全部新闻': 'Все новости',
        '公司动态': 'Новости компании',
        '产品信息': 'Информация о продуктах',
        '技术分享': 'Технические статьи',
        '展会信息': 'Информация о выставках',
        '搜索新闻...': 'Поиск новостей...',
        '最新新闻': 'Последние новости',
        '萨肯汽配参加2024年广州国际汽车零部件展览会': 'Saken Auto Parts участвует в Международной выставке автозапчастей в Гуанчжоу 2024',
        '萨肯汽配推出全新奔驰系列配件': 'Saken Auto Parts представляет новую серию запчастей для Mercedes-Benz',
        '萨肯汽配获得ISO9001质量管理体系认证': 'Saken Auto Parts получила сертификацию системы управления качеством ISO9001',
        '萨肯汽配与多家4S店达成合作': 'Saken Auto Parts заключила сотрудничество с несколькими автосалонами 4S',
        '萨肯汽配工厂扩建项目启动': 'Запущен проект расширения завода Saken Auto Parts',
        '浏览量': 'Просмотры',
        '展会图片': 'Изображение выставки',
        '产品图片': 'Изображение продукта',
        '认证图片': 'Изображение сертификата',
        '合作图片': 'Изображение сотрудничества',
        '萨肯汽配将于2024年4月10日至12日参加在广州举办的国际汽车零部件展览会，展示最新的奔驰宝马配件产品。届时，我们将在展会现场设置专业展台，展示公司的核心产品和技术优势，欢迎广大客户前来参观洽谈。': 'Saken Auto Parts будет участвовать в Международной выставке автозапчастей в Гуанчжоу с 10 по 12 апреля 2024 года, демонстрируя новейшие запчасти для Mercedes-Benz и BMW. Мы настроим профессиональный стенд на выставке для демонстрации ключевых продуктов и технических преимуществ компании. Добро пожаловать посетить и обсудить.',
        '萨肯汽配近日推出全新奔驰系列配件，包括发动机、底盘、电器和车身等多个系列的产品。这些产品采用优质材料和先进工艺制造，严格按照原厂标准生产，确保与原车完美匹配。新系列产品已开始接受订单，欢迎广大客户咨询采购。': 'Saken Auto Parts недавно представила новую серию запчастей для Mercedes-Benz, включая двигатель, шасси, электротехнику и кузовные изделия. Эти продукты изготовлены из высококачественных материалов и передовых технологий, строго в соответствии с заводскими стандартами для идеальной совместимости с оригинальным автомобилем. Новая серия уже принимает заказы, добро пожаловать на консультацию и покупку.',
        '萨肯汽配近日成功获得ISO9001质量管理体系认证，这标志着公司的质量管理水平达到了国际标准。通过认证，公司将进一步加强质量管理，提高产品质量和服务水平，为客户提供更加可靠的产品和服务。': 'Saken Auto Parts недавно успешно получила сертификацию системы управления качеством ISO9001, что свидетельствует о том, что уровень управления качеством компании достиг международных стандартов. Благодаря сертификации компания будет дальше укреплять управление качеством, повышать качество продукции и уровень обслуживания, предоставляя клиентам более надежные продукты и услуги.',
        '萨肯汽配近日与多家奔驰宝马4S店达成合作协议，成为其指定的配件供应商。这一合作将进一步扩大公司的市场份额，提高品牌知名度。同时，公司将为4S店提供更加专业的技术支持和售后服务，共同为客户提供优质的服务体验。': 'Saken Auto Parts недавно заключила соглашения о сотрудничестве с несколькими автосалонами Mercedes-Benz и BMW 4S, став их официальным поставщиком запчастей. Это сотрудничество еще больше расширит долю рынка компании и повысит узнаваемость бренда. В то же время компания будет предоставлять более профессиональную техническую поддержку и послепродажное обслуживание автосалонам 4S, вместе создавая высококачественный опыт обслуживания клиентов.',
        '阅读更多 →': 'Читать далее →',
        # 分页
        '上一页': 'Предыдущая',
        '下一页': 'Следующая',
        '跳转': 'Перейти',
        '页': 'страница',
        # FAQ页面
        '查看答案': 'Показать ответ',
        # 联系我们页面
        # 工厂页面
        '生产设备': 'Оборудование',
        '生产流程': 'Процесс',
        '品质控制': 'Контроль качества',
        '企业文化': 'Корпоративная культура',
        '企业荣誉': 'Награда',
        # 服务页面
        '技术支持': 'Техподдержка',
        '物流配送': 'Доставка',
        '培训服务': 'Обучение',
        '专业服务': 'Профессиональный сервис',
        '全国配送': 'Доставка по всей стране',
        '在线报价': 'Онлайн расчет',
        '专业客服团队，快速响应报价需求': 'Профессиональная команда поддержки, быстрый отклик на запросы',
        '海量库存，大部分配件当天发货': 'Большой запас, большинство запчастей отправляются в тот же день',
        '售后保障': 'Гарантия',
        # 关于我们页面
        '关于我们': 'О нас',
        '关于萨肯': 'О нас',
        '公司简介': 'О компании',
        '公司信息': 'Информация',
        '快速链接': 'Быстрые ссылки',
        '服务承诺': 'Гарантии',
        '北京云孚汽车贸易有限公司': 'Beijing Yunfu Automobile Trade Co., Ltd.',
        '公司地址：北京市朝阳区小红门 69 号': 'Адрес: №69 Xiaohongmen, район Chaoyang, Пекин',
        '服务热线：400 626 0128': 'Телефон: 400 626 0128',
        '微信客服：sakenqp123': 'WeChat: sakenqp123',
        '邮箱：shakoln@163.com': 'Email: shakoln@163.com',
        '正品保证': 'Оригинал',
        '现货供应': 'В наличии',
        '快速配送': 'Быстрая доставка',
        # 面包屑导航
        # 车型页面
        '热门车型': 'Популярные модели',
        '查看配件': 'Посмотреть запчасти',
        '查看详情': 'Подробнее',
        '奔驰C级': 'Mercedes-Benz C-Класс',
        '豪华轿车': 'Люкс седан',
        '宝马3系': 'BMW 3 серии',
        '奔驰E级': 'Mercedes-Benz E-Класс',
        '奔驰S级': 'Mercedes-Benz S-Класс',
        '宝马5系': 'BMW 5 серии',
        '宝马7系': 'BMW 7 серии',
        '宝马X3': 'BMW X3',
        '奔驰GLC': 'Mercedes-Benz GLC',
        # 产品详情页面
        '产品详情': 'Детали продукта',
        '库存:': 'На складе:',
        '件': 'шт',
        '品牌:': 'Бренд:',
        '车型:': 'Модель:',
        'OE号:': 'OE №:',
        '配件名称:': 'Название:',
        '产品描述': 'Описание',
        '产品不存在': 'Товар не найден',
        '抱歉，您查询的产品不存在或已下架': 'Извините, товар не найден или снят с производства.',
        '返回首页': 'На главную',
        # 加载相关
        '加载中...': 'Загрузка...',
        '加载失败': 'Ошибка загрузки',
        '参数错误，请提供有效的OE号': 'Неверный параметр, введите действительный OE номер',
        # 其他
        '萨肯汽配': 'Saken Auto Parts',
        '专业汽车配件': 'Профессиональные автозапчасти',
        '官网': 'Официальный сайт',
        '微信客服': 'WeChat Поддержка',
        '现货库存': 'Склад'
    },
    
    'ar': {
        # 导航和通用
        '首页': 'الرئيسية',
        '产品中心': 'المنتجات',
        '车型查询': 'موديلات السيارات',
        '车型大全': 'موديلات السيارات',
        '实力工厂': 'المصنع',
        '服务中心': 'الخدمات',
        '新闻资讯': 'الأخبار',
        '常见问题': 'الأسئلة الشائعة',
        '联系我们': 'اتصل بنا',
        '关于我们': 'معلومات عنا',
        '关于萨肯': 'معلومات عنا',
        '公司简介': 'نبذة عن الشركة',
        '企业文化': 'ثقافة الشركة',
        '发展历程': 'التاريخ',
        '荣誉资质': 'الشهادات',
        '团队介绍': 'الفريق',
        '现货库存': 'المخزون',
        '微信客服': 'خدمة WeChat',
        
        # 标题
        '公司信息': 'معلومات الشركة',
        '快速链接': 'روابط سريعة',
        '服务承诺': 'وعود الخدمة',
        '联系方式': 'اتصل بنا',
        
        # 首页
        'OE号查询': 'البحث برقم OE',
        '请输入OE号': 'أدخل رقم OE',
        '查询': 'بحث',
        '四大优势': 'أربع مزايا',
        '品牌优势': 'ميزة العلامة',
        '品质保证': 'ضمان الجودة',
        '服务优势': 'ميزة الخدمة',
        '价格优势': 'ميزة السعر',
        '畅销车型': 'الموديلات الشائعة',
        '查看配件': 'عرض القطع',
        '查看详情': 'التفاصيل',
        '爆款推荐': 'المنتجات الشائعة',
        '库存：': 'المخزون: ',
        '三大服务': 'ثلاث خدمات',
        '技术支持': 'الدعم الفني',
        '售后保障': 'الضمان',
        '配送服务': 'التوصيل',
        '了解更多': 'اعرف المزيد',
        '车型查找': 'بحث عن موديل',
        '在线报价': 'عرض سعر عبر الإنترنت',
        
        # 公司信息
        '北京云孚汽车贸易有限公司': 'Beijing Yunfu Automobile Trade Co., Ltd.',
        '公司名称：': 'الشركة: ',
        '公司地址：北京市朝阳区小红门 69 号': 'العنوان: 69 Xiaohongmen، حي Chaoyang، بكين',
        '服务热线：400 626 0128': 'الهاتف: 400 626 0128',
        '微信客服：sakenqp123': 'WeChat: sakenqp123',
        '邮箱：shakoln@163.com': 'البريد: shakoln@163.com',
        '正品保证': 'ضمان الأصالة',
        '现货供应': 'متوفر',
        '快速配送': 'توصيل سريع',
        '售后保障': 'الضمان',
        
        # 产品相关
        '机油滤清器': 'مرشح الزيت',
        '空气滤清器': 'مرشح الهواء',
        '燃油滤清器': 'مرشح الوقود',
        '空调滤清器': 'مرشح المقصورة',
        '火花塞': 'شمعات الإشعال',
        '刹车片': 'وسادات الفرامل',
        '刹车盘': 'قرص الفرامل',
        '水泵': 'مضخة الماء',
        '奔驰': 'مرسيدس بنز',
        '宝马': 'BMW',
        '奥迪': 'أودي',
        '现货': 'متوفر',
        '库存紧张': 'كمية محدودة',
        '品牌：': 'العلامة: ',
        '车型：': 'الموديل: ',
        'OE号：': 'رقم OE: ',
        '配件名称：': 'الاسم: ',
        
        # 车型
        '奔驰C级': 'مرسيدس بنز الفئة C',
        '豪华轿车': 'سيارة فاخرة',
        '宝马3系': 'BMW الفئة 3',
        '奔驰E级': 'مرسيدس بنز الفئة E',
        '奔驰S级': 'مرسيدس بنز الفئة S',
        '宝马5系': 'BMW الفئة 5',
        '宝马7系': 'BMW الفئة 7',
        '宝马X3': 'BMW X3',
        '奔驰GLC': 'مرسيدس بنز GLC',
        
        # 其他
        '查询条件：': 'بحث: ',
        '库存查询': 'البحث في المخزون',
        '配件名称': 'اسم القطعة',
        '品牌': 'العلامة',
        '全部品牌': 'جميع العلامات',
        '库存列表': 'قائمة المخزون',
        '库存数量': 'الكمية',
        '状态': 'الحالة',
        '操作': 'الإجراء',
        '查询库存': 'بحث',
        '抱歉，您查询的产品不存在或已下架': 'عذراً، المنتج غير متوفر أو تم إزالته.',
        '返回首页': 'الرئيسية',
        '产品描述': 'الوصف',
        '本产品为萨肯汽配高品质汽车配件，采用优质材料制造，具有良好的性能和使用寿命，确保您的车辆正常运行。': 'هذا منتج عالي الجودة من Saken Auto Parts، مصنوع من مواد ممتازة لأداء ممتاز وطول عمر، يضمن تشغيل سيارتك بسلاسة.',
        '加载中...': 'جارٍ التحميل...',
        '产品不存在': 'المنتج غير موجود',
        '加载失败': 'فشل التحميل',
        '参数错误，请提供有效的OE号': 'معلمة غير صالحة، يرجى إدخال رقم OE صالح',
        
        # 服务相关
        '咨询服务': 'الاستشارات',
        '安装指导': 'دليل التثبيت',
        '产品质保': 'الضمان',
        '售后支持': 'الدعم',
        '物流配送': 'التوصيل',
        '培训服务': 'التدريب',
        
        # 工厂相关
        '实力工厂': 'المصنع',
        '生产设备': 'المعدات',
        '生产流程': 'العملية',
        '品质控制': 'مراقبة الجودة',
        '企业文化': 'الثقافة',
        '企业荣誉': 'الشهادات',
        
        # 新闻相关
        '新闻资讯': 'الأخبار',
        '企业新闻': 'أخبار الشركة',
        '行业动态': 'أخبار الصناعة',
        '阅读全文': 'اقرأ المزيد',
        
        # FAQ
        '常见问题': 'الأسئلة الشائعة',
        '更多问题': 'المزيد من الأسئلة',
        
        # 联系我们
        '联系方式': 'اتصل بنا',
        '在线留言': 'رسالة',
        '留言反馈': 'ملاحظات',
        '您的姓名': 'اسمك',
        '联系电话': 'الهاتف',
        '电子邮箱': 'البريد',
        '留言内容': 'الرسالة',
        '提交留言': 'إرسال',
        
        # 版权
        '©2025 北京云孚汽车贸易有限公司': '©2025 Beijing Yunfu Automobile Trade Co., Ltd.',
        
        # 产品页面文本
        '输入配件名、OE号或型号': 'أدخل اسم القطعة أو رقم OE أو الموديل',
        '搜索': 'بحث',
        '热门配件': 'القطع الشائعة',
        '气门室盖': 'غطاء غرفة الصمامات',
        '减震器': 'ممتص الصدمات',
        '摆臂': 'ذراع التعليق',
        'Water Pump': 'مضخة الماء',
        '水泵': 'مضخة الماء',
        '刷新': 'تحديث',
        '刷新数据和图片': 'تحديث البيانات والصور',
        '全部配件': 'جميع القطع',
        '全部系列': 'جميع السيريات',
        '共找到': 'تم العثور على',
        '件产品': 'منتج',
        '排序': 'فرز',
        '综合': 'شامل',
        '前台序号': 'ترتيب العرض',
        '价格从低到高': 'السعر: من الأقل إلى الأعلى',
        '价格从高到低': 'السعر: من الأعلى إلى الأقل',
        '销量优先': 'الأفضل المبيعات',
        
        # 产品列表文本
        'Loading Failed': 'فشل التحميل',
        '数据加载失败，请稍后重试': 'فشل تحميل البيانات، يرجى المحاولة لاحقا',
        '机油滤清器': 'مرشح الزيت',
        '空气滤清器': 'مرشح الهواء',
        '燃油滤清器': 'مرشح الوقود',
        '火花塞': 'شمعة الإشعال',
        '刹车片': 'لوحات الفرامل',
        # 新闻页面
        '首页': 'الرئيسية',
        '新闻资讯': 'الأخبار',
        '了解萨肯汽配的最新动态和行业资讯': 'تعرف على آخر التطورات وأخبار الصناعة في Saken Auto Parts',
        '新闻分类': 'فئات الأخبار',
        '全部新闻': 'جميع الأخبار',
        '公司动态': 'أخبار الشركة',
        '产品信息': 'معلومات المنتجات',
        '技术分享': 'مشاركة تقنية',
        '展会信息': 'معلومات المعارض',
        '搜索新闻...': 'ابحث في الأخبار...',
        '最新新闻': 'أحدث الأخبار',
        '萨肯汽配参加2024年广州国际汽车零部件展览会': 'Saken Auto Parts تشارك في معرض غوانغتشو الدولي لقطع غيار السيارات 2024',
        '萨肯汽配推出全新奔驰系列配件': 'Saken Auto Parts تطلق سلسلة جديدة من قطع غيار مرسيدس',
        '萨肯汽配获得ISO9001质量管理体系认证': 'Saken Auto Parts تحصل على شهادة نظام إدارة الجودة ISO9001',
        '萨肯汽配与多家4S店达成合作': 'Saken Auto Parts ت达成 اتفاقيات تعاون مع العديد من صالونات 4S',
        '萨肯汽配工厂扩建项目启动': 'إطلاق مشروع توسعة مصنع Saken Auto Parts',
        '浏览量': 'المشاهدات',
        '展会图片': 'صورة المعرض',
        '产品图片': 'صورة المنتج',
        '认证图片': 'صورة الشهادة',
        '合作图片': 'صورة التعاون',
        '萨肯汽配将于2024年4月10日至12日参加在广州举办的国际汽车零部件展览会，展示最新的奔驰宝马配件产品。届时，我们将在展会现场设置专业展台，展示公司的核心产品和技术优势，欢迎广大客户前来参观洽谈。': 'ستشارك Saken Auto Parts في معرض غوانغتشو الدولي لقطع غيار السيارات من 10 إلى 12 أبريل 2024، تعرض أحدث قطع غيار مرسيدس وبامو. سننشئ كشكًا احترافيًا في المعرض لعرض المنتجات الأساسية والمزايا التقنية للشركة. مرحبًا بالعملاء للزيارة والمناقشة.',
        '萨肯汽配近日推出全新奔驰系列配件，包括发动机、底盘、电器和车身等多个系列的产品。这些产品采用优质材料和先进工艺制造，严格按照原厂标准生产，确保与原车完美匹配。新系列产品已开始接受订单，欢迎广大客户咨询采购。': 'أطلقت Saken Auto Parts مؤخرًا سلسلة جديدة من قطع غيار مرسيدس، بما في ذلك محرك، شاسيه، كهرباء وقطع جسم. هذه المنتجات مصنوعة من مواد عالية الجودة وتقنيات متقدمة، مصنوعة بدقة وفق معايير المصنع الأصلي لضمان التوافق المثالي مع السيارة الأصلية. السلسلة الجديدة بدأت بالقبول طلبات، مرحبًا بالعملاء للاستفسار والشراء.',
        '萨肯汽配近日成功获得ISO9001质量管理体系认证，这标志着公司的质量管理水平达到了国际标准。通过认证，公司将进一步加强质量管理，提高产品质量和服务水平，为客户提供更加可靠的产品和服务。': 'حصلت Saken Auto Parts مؤخرًا على شهادة نظام إدارة الجودة ISO9001، مما يدل على أن مستوى إدارة الجودة للشركة وصل إلى المعايير الدولية. من خلال الشهادة، ستقوم الشركة بتعزيز إدارة الجودة، وتحسين جودة المنتجات ومستوى الخدمة، وتقديم منتجات وخدمات أكثر موثوقة للعملاء.',
        '萨肯汽配近日与多家奔驰宝马4S店达成合作协议，成为其指定的配件供应商。这一合作将进一步扩大公司的市场份额，提高品牌知名度。同时，公司将为4S店提供更加专业的技术支持和售后服务，共同为客户提供优质的服务体验。': 'وقعت Saken Auto Parts مؤخرًا اتفاقيات تعاون مع العديد من صالونات مرسيدس وبامو 4S، لتصبح مورد قطع الغيار المعتمد لها. سوف يقوم هذا التعاون بتوسيع حصة الشركة في السوق وزيادة شهرة العلامة التجارية. في الوقت نفسه، ستقدم الشركة دعمًا فنيًا واحترافيًا وخدمة بعد البيع للصالونات 4S، معًا لقديم تجربة خدمة عالية الجودة للعملاء.',
        '阅读更多 →': 'اقرأ المزيد →',
        # 分页
        '上一页': 'السابق',
        '下一页': 'التالي',
        '跳转': 'اذهب',
        '页': 'صفحة',
        # FAQ页面
        '查看答案': 'عرض الإجابة',
        # 联系我们页面
        # 工厂页面
        '生产设备': 'المعدات',
        '生产流程': 'العملية',
        '品质控制': 'مراقبة الجودة',
        '企业文化': 'الثقافة',
        '企业荣誉': 'الشهادات',
        # 服务页面
        '技术支持': 'الدعم الفني',
        '物流配送': 'التوصيل',
        '培训服务': 'التدريب',
        '专业服务': 'الخدمة الاحترافية',
        '全国配送': 'التوصيل في جميع أنحاء البلاد',
        '在线报价': 'عرض سعر عبر الإنترنت',
        '专业客服团队，快速响应报价需求': 'فريق دعم احترافي، استجابة سريعة للطلبات',
        '海量库存،大部分配件当天发货': 'مخزون ضخم، معظم القطع يتم إرسالها في نفس اليوم',
        '售后保障': 'الضمان',
        # 关于我们页面
        '关于我们': 'معلومات عنا',
        '关于萨肯': 'معلومات عنا',
        '公司简介': 'نبذة عن الشركة',
        '公司信息': 'معلومات الشركة',
        '快速链接': 'روابط سريعة',
        '服务承诺': 'وعود الخدمة',
        '北京云孚汽车贸易有限公司': 'Beijing Yunfu Automobile Trade Co., Ltd.',
        '公司地址：北京市朝阳区小红门 69 号': 'العنوان: 69 Xiaohongmen، حي Chaoyang، بكين',
        '服务热线：400 626 0128': 'الهاتف: 400 626 0128',
        '微信客服：sakenqp123': 'WeChat: sakenqp123',
        '邮箱：shakoln@163.com': 'البريد الإلكتروني: shakoln@163.com',
        '正品保证': 'ضمان الأصلي',
        '现货供应': 'متوفر في المخزون',
        '快速配送': 'توصيل سريع',
        # 面包屑导航
        # 车型页面
        '热门车型': 'الموديلات الشائعة',
        '查看配件': 'عرض القطع',
        '查看详情': 'التفاصيل',
        '奔驰C级': 'Mercedes-Benz الفئة C',
        '豪华轿车': 'سيارة فاخرة',
        '宝马3系': 'BMW الفئة 3',
        '奔驰E级': 'Mercedes-Benz الفئة E',
        '奔驰S级': 'Mercedes-Benz الفئة S',
        '宝马5系': 'BMW الفئة 5',
        '宝马7系': 'BMW الفئة 7',
        '宝马X3': 'BMW X3',
        '奔驰GLC': 'Mercedes-Benz GLC',
        # 产品详情页面
        '产品详情': 'تفاصيل المنتج',
        '库存:': 'المخزون:',
        '件': 'قطعة',
        '品牌:': 'العلامة:',
        '车型:': 'الموديل:',
        'OE号:': 'OE №:',
        '配件名称:': 'الاسم:',
        '产品描述': 'الوصف',
        '产品不存在': 'المنتج غير موجود',
        '抱歉，您查询的产品不存在或已下架': 'عذرًا، المنتج الذي تبحث عنه غير موجود أو تم إيقاف بيعه.',
        '返回首页': 'الرئيسية',
        # 加载相关
        '加载中...': 'جارٍ التحميل...',
        '加载失败': 'فشل التحميل',
        '参数错误，请提供有效的OE号': 'معلمة غير صالحة، يرجى تقديم رقم OE صالح',
        # 其他
        '萨肯汽配': 'Saken Auto Parts',
        '专业汽车配件': 'قطع غيار سيارات احترافية',
        '官网': 'الموقع الرسمي',
        '微信客服': 'خدمة WeChat',
        '现货库存': 'المخزون'
    }
}

# 保护路径不被翻译的正则
path_patterns = [
    r'(?<=src=["\'])[^"\']*',
    r'(?<=href=["\'])[^"\']*',
    r'(?<=url\(["\'])[^"\']*',
    r'(?<=url\()[^)]*',
    r'(?<=background-image: url\(["\'])[^"\']*'
]

def protect_paths(content):
    """保护文件路径和代码不被翻译"""
    protected = {}
    counter = 0
    
    # 1. 保护 <script> 标签内的所有内容
    script_pattern = r'<script[^>]*>([\s\S]*?)</script>'
    matches = list(re.finditer(script_pattern, content))
    # 从后往前替换，避免索引问题
    for match in reversed(matches):
        key = f"__PROTECTED_{counter}__"
        protected[key] = match.group(0)
        content = content[:match.start()] + key + content[match.end():]
        counter += 1
    
    # 2. 保护路径
    for pattern in path_patterns:
        matches = list(re.finditer(pattern, content))
        for match in reversed(matches):
            key = f"__PROTECTED_{counter}__"
            protected[key] = match.group(0)
            content = content[:match.start()] + key + content[match.end():]
            counter += 1
    
    return content, protected

def restore_paths(content, protected):
    """恢复保护的路径"""
    for key, value in protected.items():
        content = content.replace(key, value)
    return content

def adjust_links(content, lang):
    """调整链接到对应语言目录"""
    # 处理相对链接 - 不添加语言前缀，因为我们已经在语言目录下
    link_pattern = r'href="([a-zA-Z0-9_-]+\.html)"'
    def replace_link(match):
        link = match.group(1)
        # 不要调整已经有语言前缀的链接
        if link.startswith('en/') or link.startswith('ru/') or link.startswith('ar/'):
            return match.group(0)
        # 保持链接不变，因为我们已经在语言目录下
        return match.group(0)
    
    content = re.sub(link_pattern, replace_link, content)
    
    # 处理内联 JavaScript 中的 fetch 请求路径
    fetch_patterns = [
        (r'fetch\(\s*["\'](product-images\.json)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](category-structure\.json)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](product-data\.json)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](car-models-data\.json)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](vin-data\.json)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](templates/header\.html)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](templates/footer\.html)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](data/home_products\.json)["\']', r'fetch("../\1"'),
        (r'fetch\(\s*["\'](data/hot_products\.json)["\']', r'fetch("../\1"'),
    ]
    
    for pattern, replacement in fetch_patterns:
        content = re.sub(pattern, replacement, content)
    
    # 处理资源文件链接 - 添加 ../ 前缀
    resource_patterns = [
        (r'src="(assets/[^"]+)"', r'src="../\1"'),
        (r'src="(img/[^"]+)"', r'src="../\1"'),
        (r'src="(scripts/[^"]+)"', r'src="../\1"'),
        (r'src="(templates/[^"]+)"', r'src="../\1"'),
        (r'src="(data/[^"]+)"', r'src="../\1"'),
        (r'src="(fenlei-chanp-jpg/[^"]+)"', r'src="../\1"'),
        (r'src="(load_products_simple\.js)"', r'src="../\1"'),
        (r'href="(assets/[^"]+)"', r'href="../\1"'),
        (r'href="(img/[^"]+)"', r'href="../\1"'),
        (r'href="(scripts/[^"]+)"', r'href="../\1"'),
        (r'href="(templates/[^"]+)"', r'href="../\1"'),
        (r'href="(data/[^"]+)"', r'href="../\1"'),
        (r'href="(fenlei-chanp-jpg/[^"]+)"', r'href="../\1"'),
        (r'url\("?(assets/[^")]+)"?\)', r'url("../\1")'),
        (r'url\("?(img/[^")]+)"?\)', r'url("../\1")'),
        (r'url\("?(fenlei-chanp-jpg/[^")]+)"?\)', r'url("../\1")')
    ]
    
    for pattern, replacement in resource_patterns:
        content = re.sub(pattern, replacement, content)
    
    # 特别处理 product-detail.html 的链接，保持参数
    product_link_pattern = r'href="(product-detail\.html[^"]*)"'
    def replace_product_link(match):
        link = match.group(1)
        # 保持链接不变，因为我们已经在语言目录下
        return match.group(0)
    
    content = re.sub(product_link_pattern, replace_product_link, content)
    
    # 处理原来错误添加的 en/ 前缀
    wrong_prefix_pattern = fr'href="{lang}/([^"]+)"'
    def fix_wrong_prefix(match):
        link = match.group(1)
        return f'href="{link}"'
    
    content = re.sub(wrong_prefix_pattern, fix_wrong_prefix, content)
    
    return content

def translate_content(content, lang):
    """翻译内容"""
    # 先保护路径
    content, protected = protect_paths(content)
    
    # 按长度从长到短排序翻译字典，避免短词先替换长词的一部分
    sorted_items = sorted(translations[lang].items(), key=lambda x: len(x[0]), reverse=True)
    
    # 执行翻译
    for cn_text, translated_text in sorted_items:
        # 只翻译完整的词，避免部分替换
        pattern = re.compile(re.escape(cn_text))
        content = pattern.sub(translated_text, content)
    
    # 恢复路径
    content = restore_paths(content, protected)
    
    return content

def copy_and_translate_file(source_path, target_dir, lang):
    """复制并翻译文件"""
    try:
        with open(source_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 先保护所有路径
        content, protected = protect_paths(content)
        
        # 翻译内容（此时路径已被保护，不会被翻译）
        sorted_items = sorted(translations[lang].items(), key=lambda x: len(x[0]), reverse=True)
        for cn_text, translated_text in sorted_items:
            pattern = re.compile(re.escape(cn_text))
            content = pattern.sub(translated_text, content)
        
        # 先调整链接
        # 注意：此时路径还是__PROTECTED_xx__占位符，所以我们需要先恢复路径再调整链接
        # 重新组织流程：
        
        # 1. 先恢复原始路径
        content = restore_paths(content, protected)
        
        # 2. 再调整链接（添加../前缀等）
        content = adjust_links(content, lang)
        
        # 写入目标文件
        target_path = os.path.join(target_dir, os.path.basename(source_path))
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
    except Exception as e:
        print(f"Error processing {source_path}: {e}")
        return False

def copy_directory(source_dir, target_dir, lang):
    """递归复制目录"""
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    for item in os.listdir(source_dir):
        source_path = os.path.join(source_dir, item)
        target_path = os.path.join(target_dir, item)
        
        if os.path.isfile(source_path):
            # 文件直接复制
            shutil.copy2(source_path, target_path)
        elif os.path.isdir(source_path):
            # 目录递归复制
            if not os.path.exists(target_path):
                os.makedirs(target_path)
            copy_directory(source_path, target_path, lang)

def generate_language_version(base_dir, lang):
    """生成指定语言版本"""
    lang_dir = os.path.join(base_dir, lang)
    
    # 如果目录已存在，先删除
    if os.path.exists(lang_dir):
        shutil.rmtree(lang_dir)
    
    # 创建语言目录
    os.makedirs(lang_dir)
    
    # 需要处理的HTML文件列表
    html_files = [
        'index.html', 'product.html', 'product-detail.html', 'car-models.html',
        'car-models-result.html', 'factory.html', 'service.html', 'news.html',
        'news-detail.html', 'faq.html', 'contact.html', 'about.html', 
        'about-culture.html', 'about-history.html', 'about-honors.html', 
        'about-team.html', 'stock.html', 'product-benz.html', 'product-bmw.html',
        'product-body.html', 'product-chassis.html', 'product-electrical.html',
        'product-engine.html', 'quote.html', 'privacy.html', 'terms.html',
        'chassis-search.html', 'admin-login.html', 'test-product.html',
        'index_backup.html'
    ]
    
    # 处理HTML文件
    print(f"\n=== 生成 {lang} 版本 ===")
    for html_file in html_files:
        source_path = os.path.join(base_dir, html_file)
        if os.path.exists(source_path):
            if copy_and_translate_file(source_path, lang_dir, lang):
                print(f"✓ {html_file}")
            else:
                print(f"✗ {html_file} (failed)")
    
    # 复制模板文件夹（需要翻译）
    templates_source = os.path.join(base_dir, 'templates')
    templates_target = os.path.join(lang_dir, 'templates')
    if not os.path.exists(templates_target):
        os.makedirs(templates_target)
    
    for template_file in ['header.html', 'footer.html']:
        source_path = os.path.join(templates_source, template_file)
        if os.path.exists(source_path):
            if copy_and_translate_file(source_path, templates_target, lang):
                print(f"✓ templates/{template_file}")
    
    # 复制其他模板文件（不翻译）
    for template_file in ['load-templates.js', 'pagination.js', '产品导入模板.xlsx']:
        source_path = os.path.join(templates_source, template_file)
        target_path = os.path.join(templates_target, template_file)
        if os.path.exists(source_path):
            shutil.copy2(source_path, target_path)
            print(f"✓ templates/{template_file} (copied)")
    
    # 复制资源文件夹（不复制 fenlei-chanp-jpg，多语言版本通过 ../ 引用根目录）
    print("\n复制资源文件...")
    resource_dirs = ['assets', 'img', 'data', 'scripts']
    for dir_name in resource_dirs:
        source_dir = os.path.join(base_dir, dir_name)
        target_dir = os.path.join(lang_dir, dir_name)
        if os.path.exists(source_dir):
            # 创建符号链接或者复制 - 这里用复制以确保完全独立
            if os.path.exists(target_dir):
                shutil.rmtree(target_dir)
            shutil.copytree(source_dir, target_dir, symlinks=True)
            print(f"✓ {dir_name}/")
    
    # 复制load_products_simple.js文件（多语言版本不需要，因为已经用../引用根目录文件）
    # 不需要复制，因为多语言版本直接引用根目录的../load_products_simple.js
    
    print(f"\n✓ {lang} 版本生成完成！")

def main():
    base_dir = '/Users/liuhongwei/Desktop/网站设计/网页'
    
    # 生成英文版本
    generate_language_version(base_dir, 'en')
    
    # 生成俄文版本
    generate_language_version(base_dir, 'ru')
    
    # 生成阿拉伯文版本
    generate_language_version(base_dir, 'ar')
    
    print("\n" + "="*50)
    print("✓ 所有多语言版本生成完成！")
    print("\n访问地址：")
    print("  中文：http://localhost:8080")
    print("  英文：http://localhost:8080/en/")
    print("  俄文：http://localhost:8080/ru/")
    print("  阿拉伯文：http://localhost:8080/ar/")
    print("="*50)

if __name__ == '__main__':
    main()
