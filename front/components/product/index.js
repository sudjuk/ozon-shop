export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getCategoryLabel(category) {
        const categories = {
            'electronics': 'Электроника',
            'clothing': 'Одежда',
            'books': 'Книги',
            'toys': 'Игрушки',
            'home': 'Дом и сад'
        };
        return categories[category] || category;
    }

    getHTML(data) {
        return (
            `
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card mb-4">
                            <div class="row g-0">
                                <div class="col-md-5">
                                    <div style="height: 300px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 20px;">
                                        <img src="${data.src}" alt="${data.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="card-body">
                                        <h3 class="card-title mb-3">${data.title}</h3>
                                        <p class="card-price mb-4">${data.price ? data.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }) : 'Цена не указана'}</p>
                                        ${data.category ? `
                                            <p class="card-category mb-2">
                                                <span class="badge bg-primary">${this.getCategoryLabel(data.category)}</span>
                                            </p>
                                        ` : ''}
                                        ${data.age_rating ? `
                                            <p class="card-age-rating mb-4">
                                                <span class="badge bg-info">${data.age_rating}</span>
                                            </p>
                                        ` : ''}
                                        <div class="description-section">
                                            <h5 class="mb-3">Описание товара</h5>
                                            <p class="card-text">${data.text || 'Описание отсутствует'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
} 