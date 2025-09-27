import { ProductCardComponent } from '../../components/product-card/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';
import { MainPage } from '../../pages/main/index.js';
import { ModalComponent } from '../../components/modal/index.js';

export class CarouselPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('carousel-page');
    }

    async handleAdd() {
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
                    const { data: response, status } = await ajax.post(stockUrls.createStock(), formData);
                    console.log('Ответ сервера:', status, response);
                    if (status === 201) {
                        const modalElement = document.getElementById('productModal');
                        const bsModal = bootstrap.Modal.getInstance(modalElement);
                        if (bsModal) {
                            bsModal.hide();
                        }
                        
                        modalElement.addEventListener('hidden.bs.modal', () => {
                            modal.remove();
                            location.reload();
                        });
                    } else {
                        console.error('Ошибка при создании товара:', status, response);
                        alert('Ошибка при создании товара');
                    }
                } catch (error) {
                    console.error('Сетевая ошибка при создании товара:', error);
                    alert('Сетевая ошибка при создании товара');
                }
            }
        });
    }

    getHTML() {
        return (
            `
                <div id="carousel-page" class="container">
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
                            <div style="width: 50%;">
                                <div class="input-group mb-2">
                                    <input type="text" class="form-control" id="search-input" placeholder="Поиск товаров...">
                                    <button class="btn btn-primary" id="search-button">
                                        <i class="bi bi-search"></i>
                                    </button>
                                    <button class="btn btn-outline-secondary" id="filter-toggle-btn" type="button" style="margin-left:8px;">
                                        <i class="bi bi-funnel"></i> Фильтры
                                    </button>
                                </div>
                                <div class="gap-2" id="filters-block" style="display:none;">
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
                            <div class="d-flex align-items-center gap-2">
                                <button class="btn btn-outline-primary" id="addProductBtn">
                                    <i class="bi bi-plus-lg"></i> Добавить товар
                                </button>
                                <button class="btn btn-outline-primary" id="calculatorBtn">
                                    <i class="bi bi-calculator"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="carousel-container" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner" id="carousel-inner" style="height: 708px;">
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-container" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Предыдущий</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-container" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Следующий</span>
                        </button>
                    </div>
                </div>
            `
        );
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const addProductBtn = document.getElementById('addProductBtn');
        const calculatorBtn = document.getElementById('calculatorBtn');
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const ageRatingFilter = document.getElementById('age-rating-filter');
        const filterToggleBtn = document.getElementById('filter-toggle-btn');
        const filtersBlock = document.getElementById('filters-block');

        // Скрываем фильтры по умолчанию (на всякий случай)
        if (filtersBlock) {
            filtersBlock.classList.remove('show-filters');
            filtersBlock.style.display = 'none';
        }

        if (filterToggleBtn && filtersBlock) {
            filterToggleBtn.addEventListener('click', () => {
                if (filtersBlock.classList.contains('show-filters')) {
                    filtersBlock.classList.remove('show-filters');
                    filtersBlock.style.display = 'none';
                } else {
                    filtersBlock.classList.add('show-filters');
                    filtersBlock.style.display = 'flex';
                }
            });
        }

        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.handleAdd());
        }

        if (calculatorBtn) {
            calculatorBtn.addEventListener('click', () => {
                window.location.href = 'calculator.html';
            });
        }

        const handleSearch = async () => {
            const searchText = searchInput.value.toLowerCase().trim();
            const selectedCategory = categoryFilter.value;
            const selectedAgeRating = ageRatingFilter.value;

            try {
                const { data, status } = await ajax.get(stockUrls.getStocks());
                if (status === 200) {
                    let filteredData = data;
                    if (searchText) {
                        filteredData = filteredData.filter(item =>
                            item.title.toLowerCase().includes(searchText) ||
                            (item.text && item.text.toLowerCase().includes(searchText))
                        );
                    }
                    if (selectedCategory) {
                        filteredData = filteredData.filter(item => item.category === selectedCategory);
                    }
                    if (selectedAgeRating) {
                        filteredData = filteredData.filter(item => item.age_rating === selectedAgeRating);
                    }

                    const carouselInner = document.getElementById('carousel-inner');
                    carouselInner.innerHTML = '';

                    if (filteredData.length === 0) {
                        carouselInner.innerHTML = `
                            <div class="carousel-item active">
                                <div class="d-flex justify-content-center align-items-center" style="height: 400px; background-color: #f8f9fa;">
                                    <h3>Товары не найдены</h3>
                                </div>
                            </div>
                        `;
                        return;
                    }

                    filteredData.forEach((item, index) => {
                        const div = document.createElement('div');
                        div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                        div.style.textAlign = 'center';

                        const imgContainer = document.createElement('div');
                        imgContainer.style.display = 'flex';
                        imgContainer.style.justifyContent = 'center';
                        imgContainer.style.alignItems = 'center';
                        imgContainer.style.height = '100%';

                        const img = document.createElement('img');
                        img.src = item.src || 'https://via.placeholder.com/708x94';
                        img.alt = item.title;
                        img.style.cssText = 'height: 708px !important; width: auto !important; margin: 0 auto !important; display: block !important; object-fit: contain !important;';
                        img.style.cursor = 'pointer';
                        img.onclick = () => {
                            const mainPage = new MainPage(this.parent, item.id);
                            mainPage.render();
                        };

                        imgContainer.appendChild(img);
                        div.appendChild(imgContainer);
                        carouselInner.appendChild(div);
                    });
                } else {
                    console.error('Ошибка получения данных при поиске:', status, data);
                }
            } catch (error) {
                console.error('Сетевая ошибка при поиске:', error);
                alert('Сетевая ошибка при поиске');
            }
        };

        if (searchButton) searchButton.addEventListener('click', handleSearch);
        if (searchInput) searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        if (categoryFilter) categoryFilter.addEventListener('change', handleSearch);
        if (ageRatingFilter) ageRatingFilter.addEventListener('change', handleSearch);

        this.loadInitialCarouselData();
    }

    async loadInitialCarouselData() {
        try {
            const { data, status } = await ajax.get(stockUrls.getStocks());
            console.log('Получены данные:', data, status);
            if (status === 200) {
                const carouselInner = document.getElementById('carousel-inner');
                if (!carouselInner) return;
                carouselInner.innerHTML = '';

                if (!data || data.length === 0) {
                     carouselInner.innerHTML = `
                        <div class="carousel-item active">
                            <div class="d-flex justify-content-center align-items-center" style="height: 400px; background-color: #f8f9fa;">
                                <h3>Нет товаров для отображения</h3>
                            </div>
                        </div>
                    `;
                    return;
                }

                data.forEach((item, index) => {
                    const div = document.createElement('div');
                    div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                    
                    const img = document.createElement('img');
                    img.src = item.src || 'https://via.placeholder.com/708x94';
                    img.alt = item.title;
                    img.className = 'd-block w-100';
                    img.style.cssText = 'height: 708px !important; width: auto !important; margin: 0 auto !important; display: block !important; object-fit: contain !important;';
                    img.style.cursor = 'pointer';
                    img.onclick = () => {
                        const mainPage = new MainPage(this.parent, item.id);
                        mainPage.render();
                    };
                    
                    div.appendChild(img);
                    carouselInner.appendChild(div);
                });
            } else {
                console.error('Ошибка получения данных:', status, data);
                 const carouselInner = document.getElementById('carousel-inner');
                 if (carouselInner) {
                    carouselInner.innerHTML = `
                        <div class="carousel-item active">
                            <div class="d-flex justify-content-center align-items-center" style="height: 400px; background-color: #f8f9fa;">
                                <h3>Ошибка загрузки товаров</h3>
                            </div>
                        </div>
                    `;
                 }
            }
        } catch (error) {
            console.error('Сетевая ошибка при начальной загрузке:', error);
            alert('Сетевая ошибка при начальной загрузке');
            const carouselInner = document.getElementById('carousel-inner');
            if (carouselInner) {
                carouselInner.innerHTML = `
                    <div class="carousel-item active">
                        <div class="d-flex justify-content-center align-items-center" style="height: 400px; background-color: #f8f9fa;">
                            <h3>Ошибка загрузки товаров</h3>
                        </div>
                    </div>
                `;
            }
        }
    }
} 