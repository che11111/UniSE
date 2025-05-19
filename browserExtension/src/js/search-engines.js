// Default search engines
// The user will be able to customize this list (add, remove, reorder, edit)
// URL format: use %s as a placeholder for the search query

const defaultSearchEngines = [
    {
        id: 'google',
        name: 'Google',
        url: 'https://www.google.com/search?q=%s',
        favicon: './src/ico/google.ico',
        textLogo: null
    },
    {
        id: 'bing',
        name: 'Bing',
        url: 'https://www.bing.com/search?q=%s',
        favicon: './src/ico/bing.ico',
        textLogo: null
    },
    {
        id: 'yandex',
        name: 'Yandex',
        url: 'https://yandex.com/search/?text=%s',
        favicon: './src/ico/yandex.ico',
        textLogo: null
    },
    {
        id: 'duckduckgo',
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=%s',
        favicon: './src/ico/duckduckgo.ico',
        textLogo: null 
    },
    {
        id: 'baidu',
        name: 'Baidu',
        url: 'https://www.baidu.com/s?wd=%s',
        favicon: './src/ico/baidu.ico',
        textLogo: null
    },
    {
        id: 'yahoo',
        name: 'Yahoo',
        url: 'https://search.yahoo.com/search?p=%s',
        favicon: './src/ico/yahoo.ico',
        textLogo: null
    },
    {
        id: 'naver',
        name: 'Naver',
        url: 'https://search.naver.com/search.naver?query=%s',
        favicon: './src/ico/naver.ico',
        textLogo: null
    },
    {
        id: 'wikipedia',
        name: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Special:Search?search=%s',
        favicon: './src/ico/wikipedia.ico',
        textLogo: null
    },
    {
        id: 'youtube',
        name: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=%s',
        favicon: './src/ico/youtube.ico',
        textLogo: null
    },
    {
        id: 'bilibili',
        name: 'Bilibili',
        url: 'https://search.bilibili.com/all?keyword=%s',
        favicon: './src/ico/bilibili.ico',
        textLogo: null
    },
    {
        id: 'ask',
        name: 'Ask',
        url: 'https://www.ask.com/web?q=%s',
        favicon: './src/ico/ask.ico',
        textLogo: null
    },
    {
        id: 'aol',
        name: 'AOL',
        url: 'https://search.aol.com/aol/search?q=%s',
        favicon: './src/ico/aol.ico',
        textLogo: null
    },
    {
        id: 'wolframalpha',
        name: 'WolframAlpha',
        url: 'https://www.wolframalpha.com/input/?i=%s',
        favicon: './src/ico/wolframalpha.ico',
        textLogo: null
    },
    {
        id: 'archiveorg',
        name: 'Internet Archive',
        url: 'https://archive.org/search.php?query=%s',
        favicon: './src/ico/archiveorg.ico',
        textLogo: null
    },
    {
        id: 'daum',
        name: 'Daum',
        url: 'https://search.daum.net/search?q=%s',
        favicon: './src/ico/daum.ico',
        textLogo: null
    },
    {
        id: 'seznam',
        name: 'Seznam',
        url: 'https://search.seznam.cz/?q=%s',
        favicon: './src/ico/seznam.ico',
        textLogo: null
    },
    {
        id: 'rambler',
        name: 'Rambler',
        url: 'https://nova.rambler.ru/search?query=%s',
        favicon: './src/ico/rambler.ico',
        textLogo: null
    },
    {
        id: 'qwant',
        name: 'Qwant',
        url: 'https://www.qwant.com/?q=%s',
        favicon: './src/ico/qwant.ico',
        textLogo: null
    },
    {
        id: 'ecosia',
        name: 'Ecosia',
        url: 'https://www.ecosia.org/search?q=%s',
        favicon: './src/ico/ecosia.ico',
        textLogo: null
    },
    {
        id: '360search',
        name: '360Search',
        url: 'https://www.so.com/s?q=%s',
        favicon: './src/ico/360search.ico',
        textLogo: null
    },
    {
        id: 'sogou',
        name: 'Sogou',
        url: 'https://www.sogou.com/web?query=%s',
        favicon: './src/ico/sogou.ico',
        textLogo: null
    },
    {
        id: 'zhihu',
        name: 'Zhihu',
        url: 'https://www.zhihu.com/search?type=content&q=%s',
        favicon: './src/ico/zhihu.ico',
        textLogo: null
    },
    {
        id: 'rednote',
        name: 'Rednote',
        url: 'https://www.xiaohongshu.com/search_result/?keyword=%s',
        favicon: './src/ico/rednote.ico',
        textLogo: null
    },
    {
        id: 'douyin',
        name: 'Douyin',
        url: 'https://www.douyin.com/search/%s',
        favicon: './src/ico/douyin.ico',
        textLogo: null
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        url: 'https://www.tiktok.com/search?q=%s',
        favicon: './src/ico/tiktok.ico',
        textLogo: null
    },
    {
        id: 'cnki',
        name: 'CNKI',
        url: 'https://scholar.cnki.net/home/search?sw=%s',
        favicon: './src/ico/cnki.ico',
        textLogo: null
    }
];

// Function to get search engines. Initially, it returns defaults.
// Later, this will be enhanced to load from localStorage.
function getSearchEngines() {
    const storedEngines = localStorage.getItem('userSearchEngines');
    if (storedEngines) {
        try {
            return JSON.parse(storedEngines);
        } catch (e) {
            console.error('Error parsing stored search engines:', e);
            // Fallback to default if parsing fails
            return defaultSearchEngines.map(engine => ({...engine})); // Return a copy
        }
    }
    return defaultSearchEngines.map(engine => ({...engine})); // Return a copy
}

// Function to save search engines to localStorage.
function saveSearchEngines(engines) {
    try {
        localStorage.setItem('userSearchEngines', JSON.stringify(engines));
    } catch (e) {
        console.error('Error saving search engines to localStorage:', e);
    }
}

// Function to get the currently selected search engine.
function getCurrentSearchEngine() {
    const engines = getSearchEngines();
    const selectedEngineId = localStorage.getItem('selectedSearchEngineId');
    if (selectedEngineId) {
        const foundEngine = engines.find(engine => engine.id === selectedEngineId);
        if (foundEngine) return foundEngine;
    }
    // Default to the first engine if none selected or found
    if (engines.length > 0) {
        localStorage.setItem('selectedSearchEngineId', engines[0].id);
        return engines[0];
    }
    return null; // Should not happen if defaults are present
}

// Function to set the current search engine.
function setCurrentSearchEngine(engineId) {
    const engines = getSearchEngines();
    const engineExists = engines.some(engine => engine.id === engineId);
    if (engineExists) {
        localStorage.setItem('selectedSearchEngineId', engineId);
    } else {
        console.error(`Engine with id ${engineId} not found.`);
    }
}