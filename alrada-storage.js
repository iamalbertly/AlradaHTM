const AlradaStorage = {
    dbName: 'AlradaDB',
    dbVersion: 1,

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('products')) {
                    db.createObjectStore('products', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('transactions')) {
                    db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    },

    async cacheProducts(products) {
        const db = await this.initDB();
        const transaction = db.transaction(['products'], 'readwrite');
        const store = transaction.objectStore('products');
        
        return Promise.all(products.map(product => {
            return new Promise((resolve, reject) => {
                const request = store.put(product);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }));
    }
}; 