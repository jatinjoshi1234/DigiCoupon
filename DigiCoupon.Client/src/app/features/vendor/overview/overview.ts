import { ApiResponse, PaginationRequest } from '@/app/core/models/api-response-model';
import { Component, inject, signal } from '@angular/core';
import { VenderService, VendorDto } from '../vender-service';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { form, required, FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, LazyLoadEvent, MessageService, SortEvent } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PAGE_URL, URL } from '@/app/core/constants';
import { Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
    selector: 'app-overview',
    imports: [ToolbarModule, InputIconModule, SelectModule, FormsModule, IconFieldModule, InputTextModule, InputGroupModule, ToolbarModule, ButtonModule, InputGroupAddonModule, TableModule, ConfirmDialogModule],
    templateUrl: './overview.html',
    styleUrl: './overview.scss'
})
export class Overview {
    service = inject(VenderService);
    router = inject(Router);
    vendors = signal<VendorDto[]>([]);
    totalRecords = 0;
    loading = false;
    confirmService = inject(ConfirmationService);
    toastService = inject(MessageService);
    pagination = signal<PaginationRequest>({
        PageNumber: 1,
        PageSize: 10,
        Search: '',
        OrderBy: 'Id',
        SortOrder: 'asc'
    });

    ngOnInit() {}

    loadVendors() {
        this.service.get(this.pagination()).subscribe({
            next: (res) => {
                this.totalRecords = res.totalRecords;
                this.vendors.set(res.data);
                this.loading = false;
                console.log('get list res => ', res.data);
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    getVendors(event: TableLazyLoadEvent) {
        this.loading = true;

        const page = event.first ?? 0; //(event.first ?? 0) / (event.rows ?? 10);
        const size = event.rows ?? 10;

        this.pagination.update((current) => ({
            ...current,
            PageNumber: page,
            PageSize: size
        }));
        this.loadVendors();
    }

    onSort(event: SortEvent) {
        this.pagination.update((p) => ({
            ...p,
            SortBy: event.field,
            SortOrder: event.order === 1 ? 'asc' : 'desc'
        }));

        this.loadVendors();
    }

    onSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        this.pagination.update((x) => ({ ...x, Search: input.value }));
        this.loadVendors();
    }

    addVendor() {
        this.router.navigate([`/pages/vendor/details`]);
    }

    editVendor(vendor: VendorDto) {
        console.log('Edit category => ', vendor);
        this.router.navigate([PAGE_URL.vendorDetails, vendor.id]);
    }

    deleteVendor(vendor: VendorDto) {
        //this.categoryModel.set(category);
        this.confirmService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                // this.selectedProducts = null;
                this.loading = true;
                this.service.delete(vendor.id).subscribe({
                    next: (res: ApiResponse) => {
                        if (res.status) {
                            this.loadVendors();
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
}
