import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormField } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { VenderService, VendorConfigure } from '../vender-service';
import { ApiResponse } from '@/app/core/models/api-response-model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-configuration',
    standalone: true,
    imports: [ToolbarModule, InputTextModule, IconFieldModule, TableModule, FloatLabelModule, InputIconModule, ToastModule, ButtonModule, SplitButtonModule, PanelModule, FieldsetModule, FormsModule, ConfirmDialogModule],
    templateUrl: './configuration.html',
    styleUrl: './configuration.scss'
})
export class Configuration {
    service = inject(VenderService);
    vendorType: string = '';
    vendorCategory: string = '';
    toastService = inject(MessageService);
    confirmService = inject(ConfirmationService);
    vendorTypes = signal<VendorConfigure[]>([
        {
            id: undefined,
            name: '',
            type: 0
        }
    ]);
    typeLoading = signal<boolean>(false);
    categoryLoading = signal<boolean>(false);
    vendorCategories = signal<VendorConfigure[]>([
        {
            id: undefined,
            name: '',
            type: 0
        }
    ]);

    vendorTypeData = signal<VendorConfigure>({
        id: undefined,
        name: '',
        type: 10
    });

    vendorCategoryData = signal<VendorConfigure>({
        id: undefined,
        name: '',
        type: 20
    });

    private upsertVendorType(item: VendorConfigure): void {
        if (item.type === 10) {
            this.vendorTypes.update((items) => {
                const index = items.findIndex((x) => x.id === item.id);

                if (index === -1) {
                    return [...items, item];
                }

                const updatedItems = [...items];
                updatedItems[index] = item;

                return updatedItems;
            });
        }

        if (item.type === 20) {
            this.vendorCategories.update((items) => {
                const index = items.findIndex((x) => x.id === item.id);

                if (index === -1) {
                    return [...items, item];
                }

                const updatedItems = [...items];
                updatedItems[index] = item;

                return updatedItems;
            });
        }
    }

    private removeVendorConfig(item: VendorConfigure): void {
        if (item.type === 10) {
            this.vendorTypes.update((items) => items.filter((x) => x.id !== item.id));
        }

        if (item.type === 20) {
            this.vendorCategories.update((items) => items.filter((x) => x.id !== item.id));
        }
    }

    ngOnInit() {
        this.service.getVendorConfig().subscribe({
            next: (res: ApiResponse) => {
                console.log('res =>', res);
                if (res && res.data) {
                    this.vendorTypes.set(res.data.filter((x: VendorConfigure) => x.type === 10));
                    this.vendorCategories.set(res.data.filter((x: VendorConfigure) => x.type === 20));
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    saveType(type: number) {
        this.isLoading(type, true);
        const isCategoryType = type === 20;
        let postData = isCategoryType ? this.vendorCategoryData() : this.vendorTypeData();

        if (postData.id) {
            this.service.putVendorConfig(postData.id, postData).subscribe({
                next: (res: ApiResponse) => {
                    console.log('post category res => ', res);
                    this.isLoading(type, false);
                    if (res.status && res.data) {
                        this.resetData(type);
                        postData.id = res.data;
                        this.upsertVendorType(postData);
                        this.toastService.add({
                            severity: 'success',
                            summary: res.message,
                            detail: 'Success'
                        });
                    } else {
                        this.toastService.add({
                            severity: 'error',
                            summary: res.message,
                            detail: 'Success'
                        });
                    }
                },
                error: (err) => {
                    if (isCategoryType) {
                        this.categoryLoading.set(true);
                    } else {
                        this.typeLoading.set(true);
                    }
                    console.error(err);
                    this.toastService.add({
                        severity: 'error',
                        summary: 'Somthing went wrong, please try again!',
                        detail: 'Success'
                    });
                }
            });
        } else {
            this.service.postVendorConfig(postData).subscribe({
                next: (res: ApiResponse) => {
                    this.typeLoading.set(false);
                    if (res.status && res.data) {
                        postData.id = res.data;
                        this.isLoading(type, false);
                        this.resetData(type);
                        this.upsertVendorType(postData);
                        this.toastService.add({
                            severity: 'success',
                            summary: res.message,
                            detail: 'Success'
                        });
                    } else {
                        this.toastService.add({
                            severity: 'error',
                            summary: res.message,
                            detail: 'Success'
                        });
                    }
                },
                error: (err) => {
                    this.typeLoading.set(false);
                    console.error(err);
                    this.toastService.add({
                        severity: 'error',
                        summary: 'Somthing went wrong, please try again!',
                        detail: 'Success'
                    });
                }
            });
        }
    }

    isLoading(vendortype: number, flag: boolean) {
        if (vendortype === 20) this.categoryLoading.set(flag);
        else this.typeLoading.set(flag);
    }

    resetData(type: number) {
        if (type === 20) {
            this.vendorCategoryData.set({ id: undefined, name: '', type: type });
        } else {
            this.vendorTypeData.set({ id: undefined, name: '', type: type });
        }
    }

    editType(row: VendorConfigure) {
        if (row.type == 10) this.vendorTypeData.set({ ...row });
        else this.vendorCategoryData.set({ ...row });
        console.log('selected data => ', row);
    }

    deleteType(row: VendorConfigure) {
        console.log('delete row => ', row, row.id);
        this.confirmService.confirm({
            message: 'Are you sure you want to delete the selected vendor type?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                // this.selectedProducts = null;
                this.isLoading(row.type, true);
                this.service.deleteVendorConfig(row.id).subscribe({
                    next: (res: ApiResponse) => {
                        this.isLoading(row.type, false);
                        if (res.status) {
                            this.removeVendorConfig(row);
                            this.toastService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Category deleted successfully!',
                                life: 3000
                            });
                        } else {
                            this.isLoading(row.type, false);
                            this.toastService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: res.message,
                                life: 3000
                            });
                        }
                    },
                    error: (err) => {
                        console.error(err);
                        this.isLoading(row.type, false);
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

    saveCatgory() {
        this.service.postVendorConfig(this.vendorCategoryData()).subscribe({
            next: (res: ApiResponse) => {
                console.log('post category res => ', res);
                if (res.status && res.data) {
                    this.toastService.add({
                        severity: 'success',
                        summary: res.message
                    });
                } else {
                    this.toastService.add({
                        severity: 'error',
                        summary: res.message
                    });
                }
            },
            error: (err) => {
                console.error(err);
                this.toastService.add({
                    severity: 'error',
                    summary: 'Somthing went wrong, please try again!'
                });
            }
        });
    }
}
