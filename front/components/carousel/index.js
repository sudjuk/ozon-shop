import { products } from '../../data/products.js';
import { MainPage } from '../../pages/main/index.js';

export class CarouselComponent {
    constructor(parent) {
        this.parent = parent;
        this.carousel = null;
    }

    filterProducts(searchText) {
        if (!this.carousel) return;
        
        const filteredProducts = searchText 
            ? products.filter(item => 
                item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
            )
            : products;

        const carouselInner = this.carousel.querySelector('.carousel-inner');
        carouselInner.innerHTML = '';

        if (filteredProducts.length === 0) {
            const noResultsItem = document.createElement('div');
            noResultsItem.className = 'carousel-item active';
            noResultsItem.innerHTML = `
                <div class="d-flex align-items-center justify-content-center" style="height: 400px; background-color: #f8f9fa;">
                    <h3 class="text-muted">Товары не найдены</h3>
                </div>
            `;
            carouselInner.appendChild(noResultsItem);
            return;
        }

        filteredProducts.forEach((product, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.className = 'd-block w-100';
            img.src = product.src || 'https://via.placeholder.com/800x400';
            img.alt = product.title;
            img.style.cursor = 'pointer';
            img.onclick = () => {
                const appElement = document.getElementById('app');
                const mainPage = new MainPage(appElement, parseInt(product.id));
                mainPage.render();
            };
            
            carouselItem.appendChild(img);
            carouselInner.appendChild(carouselItem);
        });

        // Перезапускаем карусель
        const bootstrapCarousel = bootstrap.Carousel.getInstance(this.carousel);
        if (bootstrapCarousel) {
            bootstrapCarousel.to(0);
        }
    }

    render() {
        if (!products.length) return;

        const carousel = document.createElement('div');
        this.carousel = carousel;
        carousel.className = 'carousel slide';
        carousel.id = 'carouselProducts';
        carousel.setAttribute('data-bs-ride', 'carousel');
        carousel.setAttribute('data-bs-interval', '3000');

        const carouselInner = document.createElement('div');
        carouselInner.className = 'carousel-inner';

        products.forEach((product, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.className = 'd-block w-100';
            img.src = product.src || 'https://via.placeholder.com/800x400';
            img.alt = product.title;
            img.style.cursor = 'pointer';
            img.onclick = () => {
                const appElement = document.getElementById('app');
                const mainPage = new MainPage(appElement, parseInt(product.id));
                mainPage.render();
            };
            
            carouselItem.appendChild(img);
            carouselInner.appendChild(carouselItem);
        });

        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-control-prev';
        prevButton.type = 'button';
        prevButton.setAttribute('data-bs-target', '#carouselProducts');
        prevButton.setAttribute('data-bs-slide', 'prev');
        prevButton.innerHTML = `
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Предыдущий</span>
        `;

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-control-next';
        nextButton.type = 'button';
        nextButton.setAttribute('data-bs-target', '#carouselProducts');
        nextButton.setAttribute('data-bs-slide', 'next');
        nextButton.innerHTML = `
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Следующий</span>
        `;

        carousel.appendChild(carouselInner);
        carousel.appendChild(prevButton);
        carousel.appendChild(nextButton);

        this.parent.appendChild(carousel);
    }
} 