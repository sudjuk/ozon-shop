import { ProductCardComponent } from '../../components/product-card/index.js';
import { ModalComponent } from '../../components/modal/index.js';
import { CarouselPage } from '../carousel/index.js';
import { ProductPage } from '../product/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';

export class MainPage {
    constructor(parent, productId = null) {
        this.parent = parent;
        this.searchText = '';
        this.productId = productId;
        this.selectedCategory = '';
        this.selectedAgeRating = '';
    }

    handleEdit(product) {
        const initialProductData = {
            title: product.title,
            price: product.price,
            src: product.src,
            text: product.text || "",
            category: product.category || "",
            age_rating: product.age_rating || ""
        };

        const modal = new ModalComponent(this.parent);
        modal.render({
            title: 'Редактировать товар',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Название',
                    required: true,
                    value: product.title
                },
                {
                    name: 'price',
                    type: 'number',
                    label: 'Цена',
                    required: true,
                    value: product.price
                },
                {
                    name: 'src',
                    type: 'text',
                    label: 'Ссылка на изображение',
                    required: true,
                    value: product.src
                },
                {
                    name: 'text',
                    type: 'textarea',
                    label: 'Описание',
                    value: product.text
                },
                {
                    name: 'category',
                    type: 'select',
                    label: 'Категория',
                    value: product.category,
                    options: [
                        { value: '', label: 'Выберите категорию' },
                        { value: 'sport', label: 'Спорт' },
                        { value: 'recreation', label: 'Отдых' },
                        { value: 'home', label: 'Для дома' },
                        { value: 'electronics', label: 'Электроника' },
                        { value: 'clothing', label: 'Одежда' },
                        { value: 'books', label: 'Книги' },
                        { value: 'toys', label: 'Игрушки' }
                    ]
                },
                {
                    name: 'age_rating',
                    type: 'select',
                    label: 'Возрастная категория',
                    value: product.age_rating,
                    options: [
                        { value: '', label: 'Выберите возраст' },
                        { value: '6+', label: '6+' },
                        { value: '12+', label: '12+' },
                        { value: '16+', label: '16+' },
                        { value: '18+', label: '18+' }
                    ]
                }
            ],
            onSubmit: async (formData) => {
                const newPrice = parseFloat(formData.price);
                const formText = formData.text || "";

                const payload = {
                    id: product.id,
                    title: formData.title,
                    price: newPrice,
                    src: formData.src,
                    text: formText,
                    category: formData.category,
                    age_rating: formData.age_rating
                };

                const allFieldsChanged = 
                    payload.title !== initialProductData.title &&
                    payload.price !== initialProductData.price &&
                    payload.src !== initialProductData.src &&
                    payload.text !== initialProductData.text &&
                    payload.category !== initialProductData.category &&
                    payload.age_rating !== initialProductData.age_rating;

                try {
                    let responseResult;
                    if (allFieldsChanged) {
                        responseResult = await ajax.put(stockUrls.updateStockById(payload.id), payload);
                    } else {
                        responseResult = await ajax.patch(stockUrls.updateStockById(payload.id), payload);
                    }
                    const { data: responseData, status } = responseResult;

                    if (status === 200) {
                        const modalElement = document.getElementById('productModal');
                        const bsModal = bootstrap.Modal.getInstance(modalElement);
                        if (bsModal) {
                            bsModal.hide();
                        }
                        
                        modalElement.addEventListener('hidden.bs.modal', () => {
                            modal.remove();
                            this.renderProducts();
                        });
                    } else {
                        console.error(`Ошибка при обновлении товара (${allFieldsChanged ? 'PUT' : 'PATCH'}):`, status, responseData);
                        alert(`Ошибка при обновлении товара (${allFieldsChanged ? 'PUT' : 'PATCH'})`);
                    }
                } catch (error) {
                    console.error(`Сетевая ошибка при обновлении товара (${allFieldsChanged ? 'PUT' : 'PATCH'}):`, error);
                    alert(`Сетевая ошибка при обновлении товара (${allFieldsChanged ? 'PUT' : 'PATCH'})`);
                }
            }
        });
    }

    async handleDelete(productId) {
        if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
            console.log('Удаление товара с ID:', productId);
            console.log('URL для удаления:', stockUrls.removeStockById(productId));
            
            try {
                const { data, status } = await ajax.delete(stockUrls.removeStockById(productId));
                console.log('Ответ сервера при удалении:', { data, status });
                if (status === 200 || status === 204) { // Добавим проверку на 204 No Content
                    console.log('Удаление успешно, переход к карусели');
                    const carouselPage = new CarouselPage(this.parent);
                    carouselPage.render();
                } else {
                    console.error('Ошибка при удалении товара:', status, data);
                    alert('Не удалось удалить товар. Пожалуйста, попробуйте еще раз.');
                }
            } catch (error) {
                console.error('Сетевая ошибка при удалении товара:', error);
                alert('Сетевая ошибка при удалении товара. Пожалуйста, попробуйте еще раз.');
            }
        }
    }

    handleAdd() {
        const modal = new ModalComponent(this.parent);
        modal.render({
            title: 'Добавить товар',
            fields: [
                { name: 'title', type: 'text', label: 'Название', required: true },
                { name: 'price', type: 'number', label: 'Цена', required: true },
                { name: 'src', type: 'text', label: 'Ссылка на изображение', required: true },
                { name: 'text', type: 'textarea', label: 'Описание' },
                {
                    name: 'category',
                    type: 'select',
                    label: 'Категория',
                    value: '',
                    options: [
                        { value: '', label: 'Выберите категорию' },
                        { value: 'sport', label: 'Спорт' },
                        { value: 'recreation', label: 'Отдых' },
                        { value: 'home', label: 'Для дома' },
                        { value: 'electronics', label: 'Электроника' },
                        { value: 'clothing', label: 'Одежда' },
                        { value: 'books', label: 'Книги' },
                        { value: 'toys', label: 'Игрушки' }
                    ]
                },
                {
                    name: 'age_rating',
                    type: 'select',
                    label: 'Возрастная категория',
                    value: '',
                    options: [
                        { value: '', label: 'Выберите возраст' },
                        { value: '6+', label: '6+' },
                        { value: '12+', label: '12+' },
                        { value: '16+', label: '16+' },
                        { value: '18+', label: '18+' }
                    ]
                }
            ],
            onSubmit: async (formData) => {
                formData.price = parseFloat(formData.price);
                try {
                    const { data, status } = await ajax.post(stockUrls.createStock(), formData);
                    if (status === 201) {
                        this.renderProducts();
                    } else {
                        alert('Ошибка при создании товара');
                    }
                } catch (error) {
                    alert('Сетевая ошибка при создании товара');
                }
            }
        });
    }

    searchProducts() {
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-filter');
        const ageRatingSelect = document.getElementById('age-rating-filter');
        
        this.searchText = searchInput.value.toLowerCase();
        this.selectedCategory = categorySelect.value;
        this.selectedAgeRating = ageRatingSelect.value;
        
        this.renderProducts();
    }

    async renderProducts() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;
        productsContainer.innerHTML = '';
        
        try {
            const { data, status } = await ajax.get(stockUrls.getStocks());
            if (status === 200 && data) {
                let filteredData = data;
                
                // Фильтрация по поисковому запросу
                if (this.searchText) {
                    filteredData = filteredData.filter(item => 
                        item.title.toLowerCase().includes(this.searchText)
                    );
                }
                
                // Фильтрация по категории
                if (this.selectedCategory) {
                    filteredData = filteredData.filter(item => 
                        item.category === this.selectedCategory
                    );
                }
                
                // Фильтрация по возрастному рейтингу
                if (this.selectedAgeRating) {
                    filteredData = filteredData.filter(item => 
                        item.age_rating === this.selectedAgeRating
                    );
                }
                
                if (this.productId) {
                    filteredData = filteredData.filter(item => item.id === this.productId);
                }
                
                if (filteredData.length === 0) {
                    productsContainer.innerHTML = '<p class="text-center">Товары не найдены.</p>';
                    return;
                }

                filteredData.forEach((item) => {
                    const productCard = new ProductCardComponent(productsContainer);
                    productCard.render(
                        item, 
                        this.clickCard.bind(this),
                        this.handleEdit.bind(this),
                        this.handleDelete.bind(this)
                    );
                });
            } else {
                console.error('Ошибка получения продуктов:', status, data);
                productsContainer.innerHTML = '<p class="text-center">Не удалось загрузить товары.</p>';
            }
        } catch (error) {
            console.error('Сетевая ошибка при загрузке продуктов:', error);
            productsContainer.innerHTML = '<p class="text-center">Сетевая ошибка при загрузке товаров.</p>';
        }
    }

    clickCard(productId) {
        const productPage = new ProductPage(this.parent, productId);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const ageRatingFilter = document.getElementById('age-rating-filter');
        const addButton = document.getElementById('addProduct');
        
        if (searchButton) searchButton.addEventListener('click', () => this.searchProducts());
        if (searchInput) searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.searchProducts();
            }
        });
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.searchProducts());
        if (ageRatingFilter) ageRatingFilter.addEventListener('change', () => this.searchProducts());
        if (addButton) addButton.addEventListener('click', () => this.handleAdd());

        this.renderProducts();
    }

    getHTML() {
        return (
            `
                <div class="container">
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
                            ${!this.productId ? `
                                <div class="search-container">
                                    <div class="input-group mb-2">
                                        <input type="text" id="search-input" class="form-control" placeholder="Поиск товаров...">
                                        <button class="btn btn-outline-secondary" type="button" id="search-button">
                                            <i class="bi bi-search"></i>
                                        </button>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <select id="category-filter" class="form-select">
                                            <option value="">Все категории</option>
                                            <option value="sport">Спорт</option>
                                            <option value="recreation">Отдых</option>
                                            <option value="home">Для дома</option>
                                            <option value="electronics">Электроника</option>
                                            <option value="clothing">Одежда</option>
                                            <option value="books">Книги</option>
                                            <option value="toys">Игрушки</option>
                                        </select>
                                        <select id="age-rating-filter" class="form-select">
                                            <option value="">Все возрасты</option>
                                            <option value="6+">6+</option>
                                            <option value="12+">12+</option>
                                            <option value="16+">16+</option>
                                            <option value="18+">18+</option>
                                        </select>
                                    </div>
                                </div>
                            ` : ''}
                            <div class="d-flex gap-2">
                                ${!this.productId ? `
                                    <button class="btn btn-outline-primary btn-sm" id="addProduct">
                                        <i class="bi bi-plus-lg"></i> Добавить товар
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div id="products-container" class="row"></div>
                </div>
            `
        );
    }
} 