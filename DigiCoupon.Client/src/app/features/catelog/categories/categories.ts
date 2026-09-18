import { Component, inject, signal } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { form, required } from '@angular/forms/signals';
import { CategoriesDto, CategoryService, ParentCategory } from './category-service';
import { ApiResponse, PaginationRequest } from '@/app/core/models/api-response-model';
import { ConfirmationService, LazyLoadEvent, MessageService, SortEvent } from 'primeng/api';
import { SHARED_PRIM_NG_IMPORT_MODULE, SHARED_IMPORT_MODULE } from '@/app/shared/shared-import';

export interface Category {
    code: string;
    name: string;
}

const EMPTY_CATEGORY: CategoriesDto = {
    id: undefined,
    name: '',
    parentName: '',
    parentId: undefined,
    slug: ''
};

@Component({
    standalone: true,
    selector: 'app-categories',
    imports: [...SHARED_PRIM_NG_IMPORT_MODULE, ...SHARED_IMPORT_MODULE],
    templateUrl: './categories.html',
    styleUrl: './categories.scss'
})
export class Categories {
    service = inject(CategoryService);
    confirmService = inject(ConfirmationService);
    toastService = inject(MessageService);
    parentCategories = signal<Category[]>([]);
    categories = signal<CategoriesDto[]>([]);
    totalRecords = 0;
    loading = false;
    pagination = signal<PaginationRequest>({
        PageNumber: 1,
        PageSize: 10,
        Search: '',
        OrderBy: 'Id',
        SortOrder: 'asc'
    });
    showCategory = false;
    categoryModel = signal<CategoriesDto>({ ...EMPTY_CATEGORY });
    categoryForm = form(this.categoryModel, (scheme) => {
        required(scheme.name, { message: 'Category field is required ' });
    });

    ngOnInit() {
        //this.loadCategories();
        this.loadParentCategories();
    }

    mapParentCategory(x: ParentCategory) {
        const cate: Category = {
            name: x.text,
            code: x.id
        };
        return cate;
    }

    loadCategories() {
        this.service.get(this.pagination()).subscribe({
            next: (res) => {
                if (res && res.data?.length > 0) {
                    this.totalRecords = res.totalRecords;
                    this.categories.set(res.data);
                } else {
                    this.categories.set([]);
                }
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    onSort(event: SortEvent) {
        this.pagination.update((p) => ({
            ...p,
            SortBy: event.field,
            SortOrder: event.order === 1 ? 'asc' : 'desc'
        }));

        this.loadCategories();
    }

    getCategories(event: TableLazyLoadEvent) {
        this.loading = true;
        const page = event.first ?? 0;
        const size = event.rows ?? 10;

        this.pagination.update((current) => ({
            ...current,
            PageNumber: page,
            PageSize: size
        }));
        this.loadCategories();
    }

    onSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        this.pagination.update((x) => ({ ...x, Search: input.value }));
        this.loadCategories();
    }

    editCategory(category: CategoriesDto) {
        console.log('Edit category => ', category);
        this.categoryModel.set(category);
        console.log(this.categoryModel());
    }

    deleteCategory(category: CategoriesDto) {
        //this.categoryModel.set(category);
        this.confirmService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                // this.selectedProducts = null;
                this.loading = true;
                this.service.delete(category.id).subscribe({
                    next: (res: ApiResponse) => {
                        if (res.status) {
                            this.loadCategories();
                            this.loading = false;
                            this.toastService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Category deleted successfully!',
                                life: 3000
                            });
                        } else {
                            this.toastService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: res.message,
                                life: 3000
                            });
                            this.loading = false;
                        }
                    },
                    error: (err) => {
                        console.error(err);
                        this.loading = false;
                        this.toastService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Something went wrong.',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    loadParentCategories() {
        this.parentCategories.set([{ name: 'Select cateogry', code: '' }]);
        this.service.getParentCategory().subscribe({
            next: (res) => {
                this.parentCategories.set(res?.map((x) => ({ name: x.text, code: x.id })));
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    onParentCategoryChange(event: any) {
        this.categoryModel.update((x) => ({
            ...x,
            parentId: event.value
        }));
    }

    saveCategory() {
        if (this.categoryForm().invalid()) {
            this.categoryForm().markAsTouched();
            return;
        }
        this.service.post(this.categoryModel()).subscribe({
            next: (res: ApiResponse) => {
                this.categoryForm().reset({ ...EMPTY_CATEGORY });
                this.loadCategories();
                if (res.status && res.data) {
                    this.loadParentCategories();
                    this.toastService.add({
                        severity: 'Success',
                        summary: res.message
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}
