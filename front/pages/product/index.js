import { ProductComponent } from '../../components/product/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    async getData() {
        try {
            const { data, status } = await ajax.get(stockUrls.getStockById(this.id));
            if (status === 200 && data) {
                this.renderData(data);
            } else {
                console.error('Ошибка получения данных товара:', status, data);
                if (this.pageRoot) {
                    this.pageRoot.innerHTML += '<p class="text-center text-danger">Не удалось загрузить информацию о товаре.</p>';
                }
            }
        } catch (error) {
            console.error('Сетевая ошибка при получении данных товара:', error);
            if (this.pageRoot) {
                this.pageRoot.innerHTML += '<p class="text-center text-danger">Сетевая ошибка. Не удалось загрузить информацию о товаре.</p>';
            }
        }
    }

    renderData(data) {
        const product = new ProductComponent(this.pageRoot);
        product.render(data);
    }

    getHTML() {
        return (
            `
                <div id="product-page" class="container mt-4">
                    <div class="header-section mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center gap-3">
                                <a href="index.html" class="logo-link">
                                    <span class="ozon-logo-text">Ozon</span>
                                </a>
                                <button class="btn btn-outline-primary btn-sm header-theme-btn" onclick="toggleTheme()">
                                    <i class="bi bi-moon-stars"></i>
                                </button>
                            </div>
                            <h2 class="mb-0">Детали товара</h2>
                            <div style="width: 42px;"></div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.getData();
    }
} 