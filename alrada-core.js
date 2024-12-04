// Core functionality
const AlradaCore = {
    // Cache for DOM elements
    elements: new Map(),
    
    // Cache for parsed data
    dataCache: new Map(),
    
    // Initialize the application
    init() {
        this.cacheElements();
        this.loadSettings();
        this.initializeEventListeners();
    },

    // Cache frequently accessed DOM elements
    cacheElements() {
        const elements = {
            resultDisplay: document.querySelector("#result_display>ul"),
            productsView: document.getElementById("productsview"),
            searchInput: document.getElementById("search"),
            warehouseName: document.getElementById("warehouseName"),
            cachedTransSpan: document.querySelector("#cachedTrans>span")
        };

        Object.entries(elements).forEach(([key, element]) => {
            this.elements.set(key, element);
        });
    },

    // Load and cache settings data
    async loadSettings() {
        try {
            if (!this.dataCache.has('settings')) {
                const response = await fetch('alradasettings.json');
                const data = await response.json();
                this.dataCache.set('settings', data);
                this.initializeProducts();
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    },

    // Initialize product list with virtual scrolling
    initializeProducts() {
        const products = this.getProducts();
        this.virtualList.init(products, this.elements.get('productsView'));
    },

    // Virtual scrolling implementation
    virtualList: {
        itemHeight: 60,
        visibleItems: 0,
        totalItems: 0,
        
        init(items, container) {
            this.items = items;
            this.container = container;
            this.visibleItems = Math.ceil(container.clientHeight / this.itemHeight);
            this.totalItems = items.length;
            
            this.render();
            this.attachScrollListener();
        },

        render(startIndex = 0) {
            const fragment = document.createDocumentFragment();
            const endIndex = Math.min(startIndex + this.visibleItems + 3, this.totalItems);
            
            for (let i = startIndex; i < endIndex; i++) {
                const item = this.createListItem(this.items[i], i);
                fragment.appendChild(item);
            }
            
            this.container.innerHTML = '';
            this.container.appendChild(fragment);
        },

        attachScrollListener() {
            let ticking = false;
            
            this.container.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const startIndex = Math.floor(this.container.scrollTop / this.itemHeight);
                        this.render(startIndex);
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }
}; 