// 加载头部和底部模板
function loadTemplates() {
    // 获取当前语言 - 遍历查找语言部分位置（兼容 GitHub Pages 子路径部署）
    function getCurrentLang() {
        var currentPath = window.location.pathname;
        var pathParts = currentPath.split('/');
        for (var i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === 'en' || pathParts[i] === 'ru' || pathParts[i] === 'ar') {
                return pathParts[i];
            }
        }
        return ''; // 中文版本
    }
    
    var currentLang = getCurrentLang();
    
    // 获取路径前缀和模板路径
    var prefix = '';
    var templatePath = 'templates';
    if (currentLang !== '') {
        prefix = '../';
        templatePath = currentLang + '/templates';
    }
    
    // 加载头部模板
        fetch(prefix + templatePath + '/header.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('header-placeholder').innerHTML = html;
                // 执行header中的脚本
                executeHeaderScript();
                // 初始化语言切换
                initLanguageSwitcher();
            })
            .catch(error => console.error('加载头部模板失败:', error));
        
        // 加载底部模板
        fetch(prefix + templatePath + '/footer.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('footer-placeholder').innerHTML = html;
                // 触发模板加载完成事件
                var event = new CustomEvent('templatesLoaded', {
                    detail: { timestamp: Date.now() }
                });
                document.dispatchEvent(event);
            })
            .catch(error => console.error('加载底部模板失败:', error));
}

function executeHeaderScript() {
    var currentPath = window.location.pathname;
    var pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    if (!pageName) pageName = 'index.html';
    
    var navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(function(link) {
        var linkHref = link.getAttribute('href');
        if (linkHref === pageName || 
            (pageName.startsWith('product') && linkHref === 'product.html') ||
            (pageName.startsWith('car-models') && linkHref === 'car-models.html')) {
            link.parentElement.classList.add('active');
        }
    });
}

// 初始化语言切换器 - 遍历查找语言部分位置（兼容 GitHub Pages 子路径部署）
function initLanguageSwitcher() {
    var langSelect = document.getElementById('langSelect');
    if (!langSelect) return;

    // 设置当前语言为选中状态 - 遍历查找语言部分位置
    var currentPath = window.location.pathname;
    var pathParts = currentPath.split('/');
    var currentLang = '';

    for (var i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === 'en' || pathParts[i] === 'ru' || pathParts[i] === 'ar') {
            currentLang = pathParts[i];
            break;
        }
    }

    // 设置选中状态
    for (var j = 0; j < langSelect.options.length; j++) {
        if (langSelect.options[j].value === currentLang) {
            langSelect.selectedIndex = j;
            break;
        }
    }

    // 添加change事件监听
    langSelect.addEventListener('change', function() {
        var selectedLang = this.value;
        switchLanguage(selectedLang);
    });
}

// Switch language
function switchLanguage(lang) {
    var currentPath = window.location.pathname;
    var pathParts = currentPath.split('/');
    var searchQuery = window.location.search;
    var fileName = pathParts[pathParts.length - 1] || 'index.html';

    // 1. Find language part in the path
    var langIndex = -1;
    for (var i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === 'en' || pathParts[i] === 'ru' || pathParts[i] === 'ar') {
            langIndex = i;
            break;
        }
    }

    // 2. Get base path (preserve subpath deployment prefix like /repo-name/)
    var baseParts = [];
    for (var j = 1; j < pathParts.length - 1; j++) {
        if (j !== langIndex) {
            baseParts.push(pathParts[j]);
        }
    }

    var basePath = (baseParts.length > 0) ? '/' + baseParts.join('/') + '/' : '/';

    // 3. Generate new path
    var newPath = '';
    if (lang === '') {
        newPath = basePath + fileName + searchQuery;
    } else {
        newPath = basePath + lang + '/' + fileName + searchQuery;
    }

    window.location.href = newPath;
}

// Page面加载完成后加载模板
document.addEventListener('DOMContentLoaded', loadTemplates);
