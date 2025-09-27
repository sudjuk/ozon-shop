export class ModalComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(options) {
        return (
            `
                <div class="modal fade" id="productModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${options.title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="productForm">
                                    ${options.fields.map(field => `
                                        <div class="mb-3">
                                            <label for="${field.name}" class="form-label">${field.label}</label>
                                            ${field.type === 'textarea' 
                                                ? `<textarea class="form-control" id="${field.name}" ${field.required ? 'required' : ''}>${field.value || ''}</textarea>`
                                                : field.type === 'select'
                                                ? `<select class="form-select" id="${field.name}" ${field.required ? 'required' : ''}>
                                                    ${field.options.map(option => `
                                                        <option value="${option.value}" ${field.value === option.value ? 'selected' : ''}>
                                                            ${option.label}
                                                        </option>
                                                    `).join('')}
                                                   </select>`
                                                : `<input type="${field.type}" class="form-control" id="${field.name}" value="${field.value || ''}" ${field.required ? 'required' : ''}>`
                                            }
                                        </div>
                                    `).join('')}
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                                <button type="button" class="btn btn-primary" id="saveProduct">Сохранить</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        );
    }

    remove() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.remove();
        }
    }

    render(options) {
        this.remove();
        const html = this.getHTML(options);
        this.parent.insertAdjacentHTML('beforeend', html);

        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();

        const form = document.getElementById('productForm');
        const saveBtn = document.getElementById('saveProduct');

        if (saveBtn && options.onSubmit) {
            saveBtn.addEventListener('click', () => {
                if (form.checkValidity()) {
                    const formData = {};
                    options.fields.forEach(field => {
                        formData[field.name] = document.getElementById(field.name).value;
                    });
                    options.onSubmit(formData);
                } else {
                    form.reportValidity();
                }
            });
        }
    }
} 