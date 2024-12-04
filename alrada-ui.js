// UI handling
const AlradaUI = {
    // Debounced search handler
    initializeSearch() {
        const searchInput = AlradaCore.elements.get('searchInput');
        
        const debouncedSearch = this.debounce((value) => {
            const filteredProducts = this.filterProducts(value);
            AlradaCore.virtualList.init(filteredProducts, AlradaCore.elements.get('productsView'));
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value.toLowerCase());
        });
    },

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    filterProducts(searchTerm) {
        const products = AlradaCore.getProducts();
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
}; 