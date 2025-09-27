const savedProducts = localStorage.getItem('products');
export let products = savedProducts ? JSON.parse(savedProducts) : [];

export function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
} 