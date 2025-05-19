document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const currentSearchEngineLogoContainer = document.getElementById('current-search-engine-logo-container');
    const searchSourcesListContainer = document.getElementById('search-sources-list'); // For event delegation
    const appLogo = document.getElementById('app-logo');

    // 点击logo刷新页面
    if (appLogo) {
        appLogo.addEventListener('click', () => {
            location.reload();
        });
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query === '') return;

        const currentEngine = getCurrentSearchEngine();
        if (currentEngine && currentEngine.url) {
            const searchUrl = currentEngine.url.replace('%s', encodeURIComponent(query));
            window.open(searchUrl, '_blank'); // Open in new tab
        } else {
            alert('Please select a search engine or configure one in settings.');
        }
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // 主页搜索栏旁边添加各个搜索引擎icon图标，便于快捷切换（桌面端最多15个，移动端7个，其余省略号）
    function renderSearchEngineIconsBar() {
        const iconsBar = document.getElementById('search-engine-icons-bar');
        if (!iconsBar) return;
        iconsBar.innerHTML = '';
        const engines = getSearchEngines();
        const currentId = localStorage.getItem('selectedSearchEngineId');
        const isMobile = window.matchMedia('(max-width: 800px)').matches;
        const maxIcons = isMobile ? 7 : 15;
        engines.slice(0, maxIcons).forEach(engine => {
            const iconBtn = document.createElement('button');
            iconBtn.className = 'engine-icon-btn neumorphic-button';
            iconBtn.title = engine.name;
            iconBtn.style.border = engine.id === currentId ? '2px solid var(--primary-color-light)' : 'none';
            let iconImg = document.createElement('img');
            // 优先加载本地文件路径的textLogo
            if (engine.textLogo && typeof engine.textLogo === 'string' && engine.textLogo.trim() !== '' && (engine.textLogo.startsWith('src/') || engine.textLogo.endsWith('.png') || engine.textLogo.endsWith('.jpg'))) {
                iconImg.src = engine.textLogo;
                iconImg.alt = engine.name + ' Logo';
                iconImg.className = 'engine-text-logo';
            } else if (engine.favicon) {
                iconImg.src = engine.favicon;
                iconImg.alt = engine.name + ' Favicon';
                iconImg.className = 'engine-favicon';
            } else {
                iconImg = document.createElement('span');
                iconImg.textContent = engine.name;
                iconImg.className = 'engine-text';
            }
            iconBtn.appendChild(iconImg);
            iconBtn.addEventListener('click', () => {
                setCurrentSearchEngine(engine.id);
                updateCurrentSearchEngineDisplay();
                renderSearchEngineIconsBar();
            });
            iconsBar.appendChild(iconBtn);
        });
        if (engines.length > maxIcons) {
            const moreBtn = document.createElement('button');
            moreBtn.className = 'engine-icon-btn neumorphic-button';
            moreBtn.textContent = '...';
            moreBtn.title = '更多搜索引擎';
            iconsBar.appendChild(moreBtn);
        }
    }

    // 修复text-logo图片未正确加载问题，优先本地路径
    function fixTextLogoPath(engine) {
        if (!engine) return engine;
        if (engine.textLogo && typeof engine.textLogo === 'string' && engine.textLogo.trim() !== '') {
            // 若不是以src/开头且不是http/https，则自动补全为src/se-text-logo/xxx.png
            if (!engine.textLogo.startsWith('src/') && !engine.textLogo.startsWith('http') && !engine.textLogo.startsWith('https')) {
                engine.textLogo = 'src/se-text-logo/' + engine.textLogo.replace(/^\/+/, '');
            }
            return engine;
        }
        // 若textLogo为null或无效，降级为favicon
        engine.textLogo = null;
        return engine;
    }

    // 重写 updateCurrentSearchEngineDisplay 以修复text-logo加载优先级
    function updateCurrentSearchEngineDisplay() {
        const currentEngine = fixTextLogoPath(getCurrentSearchEngine());
        currentSearchEngineLogoContainer.innerHTML = '';
        if (currentEngine) {
            let logoElement;
            if (currentEngine.textLogo && typeof currentEngine.textLogo === 'string' && currentEngine.textLogo.trim() !== '') {
                logoElement = document.createElement('img');
                logoElement.src = currentEngine.textLogo;
                logoElement.alt = `${currentEngine.name} Logo`;
                logoElement.style.maxHeight = '35px';
                logoElement.style.maxWidth = '150px';
            } else if (currentEngine.favicon) {
                logoElement = document.createElement('img');
                logoElement.src = currentEngine.favicon;
                logoElement.alt = `${currentEngine.name} Favicon`;
                logoElement.style.maxHeight = '24px';
                logoElement.style.marginRight = '8px';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = currentEngine.name;
                nameSpan.style.fontSize = '1.2em';
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';
                wrapper.appendChild(logoElement);
                wrapper.appendChild(nameSpan);
                currentSearchEngineLogoContainer.appendChild(wrapper);
                return;
            } else {
                logoElement = document.createElement('span');
                logoElement.textContent = currentEngine.name;
                logoElement.style.fontSize = '1.2em';
            }
            if (logoElement) {
                currentSearchEngineLogoContainer.appendChild(logoElement);
            }
        } else {
            currentSearchEngineLogoContainer.textContent = 'No search engine selected';
        }
    }

    // Handle clicks on search source items in the settings panel to select them
    if (searchSourcesListContainer) {
        searchSourcesListContainer.addEventListener('click', (event) => {
            const targetItem = event.target.closest('.search-source-item');
            if (targetItem && targetItem.dataset.id) {
                // Check if the click was on an action button within the item
                if (event.target.closest('.actions')) {
                    return; // Do not change selected engine if an action button was clicked
                }
                setCurrentSearchEngine(targetItem.dataset.id);
                updateCurrentSearchEngineDisplay();
                // Optionally, provide visual feedback for selection in the list itself
                document.querySelectorAll('#search-sources-list .search-source-item').forEach(item => {
                    item.style.border = item.dataset.id === targetItem.dataset.id ? '2px solid var(--primary-color-light)' : 'none';
                });
            }
        });
    }

    // Initial setup
    function initializeApp() {
        // Ensure default engines are set if none exist in localStorage
        if (!localStorage.getItem('userSearchEngines')) {
            saveSearchEngines(defaultSearchEngines.map(engine => ({...engine})));
        }
        // Ensure a default selected engine is set
        if (!localStorage.getItem('selectedSearchEngineId') && getSearchEngines().length > 0) {
            setCurrentSearchEngine(getSearchEngines()[0].id);
        }

        const initialLang = getInitialLanguage();
        setLanguage(initialLang);
        document.getElementById('language-select').value = initialLang;

        const initialTheme = localStorage.getItem('userTheme') || 'light';
        document.body.classList.toggle('dark-theme', initialTheme === 'dark');

        updateCurrentSearchEngineDisplay();
        // Settings.js will call renderSearchSources which also calls updateCurrentSearchEngineDisplay
        // but calling it here ensures it's set on initial load before settings might be opened.
        renderSearchEngineIconsBar();
    }

    initializeApp();

    // Make updateCurrentSearchEngineDisplay globally accessible for settings.js
    window.updateCurrentSearchEngineDisplay = updateCurrentSearchEngineDisplay;
});
