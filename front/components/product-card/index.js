export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="col-12 col-sm-6 col-lg-4 mb-4">
                    <div class="card" style="max-width: 300px; margin: 0 auto;">
                        <div style="height: 200px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 15px;">
                            <img src="${data.src}" alt="${data.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-price">${data.price ? data.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }) : 'Цена не указана'}</p>
                            ${data.category ? `
                                <p class="card-category">
                                    <span class="badge bg-primary">${this.getCategoryLabel(data.category)}</span>
                                </p>
                            ` : ''}
                            ${data.age_rating ? `
                                <p class="card-age-rating">
                                    <span class="badge bg-info">${data.age_rating}</span>
                                </p>
                            ` : ''}
                            <div class="card-actions">
                                <button class="btn btn-outline-primary" data-id="${data.id}" data-action="detail">
                                    <i class="bi bi-info-circle"></i>
                                </button>
                                <button class="btn btn-outline-primary" data-id="${data.id}" data-action="edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-outline-danger" data-id="${data.id}" data-action="delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    getCategoryLabel(category) {
        const categories = {
            'sport': 'Спорт',
            'recreation': 'Отдых',
            'home': 'Для дома',
            'electronics': 'Электроника',
            'clothing': 'Одежда',
            'books': 'Книги',
            'toys': 'Игрушки'
        };
        return categories[category] || category;
    }

    render(data, clickHandler, editHandler, deleteHandler) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        
        const card = this.parent.lastElementChild;
        const detailButton = card.querySelector('button[data-action="detail"]');
        const editButton = card.querySelector('button[data-action="edit"]');
        const deleteButton = card.querySelector('button[data-action="delete"]');
        
        detailButton.addEventListener('click', () => clickHandler(data.id));
        editButton.addEventListener('click', () => editHandler(data));
        deleteButton.addEventListener('click', () => deleteHandler(data.id));
    }
} 