import { Component, inject, signal } from '@angular/core';
import { Field, FormField, email, form, maxLength, pattern, required } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { VenderService, VendorDto } from '../vender-service';
import { ApiResponse } from '@/app/core/models/api-response-model';
import { MessageService } from 'primeng/api';
import { Select, SelectList } from '../../models/select';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_URL, PAGE_URL } from '@/app/core/constants';
import { TabsModule } from 'primeng/tabs';
import { enviroment } from '@/enviroments/enviroment';

@Component({
    selector: 'app-vendor-registration',
    imports: [
        CommonModule,
        FormsModule,
        FormField,
        ToastModule,
        // PrimeNG
        CardModule,
        DividerModule,
        TabsModule,
        FloatLabelModule,
        TextareaModule,
        InputTextModule,
        SelectModule,
        CheckboxModule,
        ButtonModule,
        FileUploadModule,
        MessageModule
    ],
    templateUrl: './vendor-registration.html',
    styleUrl: './vendor-registration.scss'
})
export class VendorRegistration {
    service = inject(VenderService);
    toastService = inject(MessageService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    vendorTypes = signal<Select[]>([]);
    vendorCategories = signal<Select[]>([]);
    model = signal<VendorDto>({
        id: '',
        businessName: 'Fresh Mart',
        gstNumber: '24FGHIJ5678K1Z2',
        panNumber: 'FGHIJ5678K',
        tinNumber: 'TIN100002',
        tanNumber: 'AHMF56789C',
        cinNumber: 'U52100GJ2021PTC654321',
        fssaiNumber: '10722001000002',
        licenseNumber: 'LIC100002',

        vendorName: 'Priya Shah',
        vendorType: '',
        type: '',
        category: '',
        buisnessCategory: '',

        bankAccountNo: '234567890123',
        ifsc: 'ICIC0005678',
        accountHolder: 'Fresh Mart',

        identityPic: 'Identity.jpg',

        businessEmail: 'contact@freshmart.com',
        businessPhone: '9876501234',
        website: 'https://freshmart.com',

        logo: '',
        banner: '',
        description: 'Retail supermarket chain.',
        termCondition: 'Advance payment preferred.',
        status: 'Active',

        file: '',
        approvalDate: '',

        address: {
            id: '',
            addressType: 'Business',
            country: 'India',
            state: 'Gujarat',
            city: 'Surat',
            area: 'Adajan',
            pincode: '395009',
            addressLine1: '45 Market Road',
            addressLine2: 'Opp. Lake View',
            isDefault: true
        }
    });
    vendorForm = form(this.model, (schema) => {
        // =========================
        // Vendor
        // =========================

        required(schema.businessName);

        required(schema.vendorName);

        required(schema.businessEmail);

        required(schema.businessPhone);

        required(schema.gstNumber);
        //pattern(schema.gstNumber, /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/);

        required(schema.panNumber);

        // pattern(schema.website, /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/.*)?$/);

        maxLength(schema.description, 500);
        maxLength(schema.termCondition, 500);

        required(schema.status);

        // =========================
        // Address
        // =========================

        required(schema.address.addressType);

        required(schema.address.country);

        required(schema.address.state);

        required(schema.address.city);

        required(schema.address.pincode);
    });

    description: string = '';
    termCondition: string = '';
    vendorType = '';
    vendorCategory = '';
    addressLine1 = '';
    addressLine2 = '';
    url: string = '';
    bannerUrl: string = '';
    logoUrl: string = '';
    uploadedFiles: any;

    ngOnInit() {
        //this.service.getVendorConfig
        const id = this.route.snapshot.paramMap.get('id');
        this.getVendorType('');
        this.getVendorCategory('');
        this.getByid(id);
    }

    getByid(id: any) {
        this.service.getById(id).subscribe({
            next: (res) => {
                if (res && res.status) {
                    this.model.set(res.data);
                    this.vendorType = this.model().vendorType;
                    this.vendorCategory = this.model().buisnessCategory;
                    this.description = this.model().description;
                    this.termCondition = this.model().termCondition;
                    this.addressLine1 = this.model().address.addressLine1;
                    this.addressLine2 = this.model().address.addressLine2;
                    console.log('selected  => ', res.data);
                    this.url = `${enviroment.apiUrl}/uploads/vendors/${this.model().id}/${this.model().identityPic}`;
                    this.bannerUrl = `${enviroment.apiUrl}/uploads/vendors/${this.model().id}/${this.model().banner}`;
                    this.logoUrl = `${enviroment.apiUrl}/uploads/vendors/${this.model().id}/${this.model().logo}`;
                }
            },
            error: (err) => {
                console.log(' api response => ', err);
            }
        });
    }

    getVendorType(search: string) {
        this.service.searchVendorType(search, 10).subscribe({
            next: (res) => {
                if (res.status && res.data) {
                    this.vendorTypes.set(res.data.map((x: SelectList) => ({ code: x.id, name: x.text })));
                }
            },
            error: (err) => {
                console.error('Vendor component => searchVendorType => ', err);
            }
        });
    }

    getVendorCategory(search: string) {
        this.service.searchVendorType(search, 20).subscribe({
            next: (res) => {
                if (res.status && res.data) {
                    this.vendorCategories.set(res.data.map((x: SelectList) => ({ code: x.id, name: x.text })));
                }
            },
            error: (err) => {
                console.error('Vendor component => searchVendorType => ', err);
            }
        });
    }

    onFileSelect(event: any) {
        const file = event.files[0];

        if (file) {
            console.log('Selected file:', file);
            this.uploadedFiles = file;
            // Example:
            // this.logo = file;
        }
    }

    save() {
        console.log(this.model().address);

        // if (this.vendorForm().invalid()) {
        //     this.vendorForm().markAsTouched();
        //     return;
        // }

        this.model.update((x) => ({
            ...x,
            description: this.description,
            termCondition: this.termCondition,
            vendorType: this.vendorType,
            buisnessCategory: this.vendorCategory,
            address: {
                ...x.address,
                addressLine1: this.addressLine1,
                addressLine2: this.addressLine2
            }
        }));

        this.service.post(this.model()).subscribe({
            next: (res: ApiResponse) => {
                console.log('post category res => ', res);
                if (res.status && res.data) {
                    this.toastService.add({
                        severity: 'Success',
                        summary: res.message
                    });
                    this.router.navigate([`${PAGE_URL.vendorDetails}`, res.data]);
                } else {
                    this.toastService.add({
                        severity: 'Error',
                        summary: res.message
                    });
                }
            },
            error: (err) => {
                console.error(err);
                this.toastService.add({
                    severity: 'Error',
                    summary: 'Somthing went wrong, please try again!'
                });
            }
        });

        //const formData = new FormData();

        // formData.append('BusinessName', this.model().businessName);
        // formData.append('GSTNumber', this.model().gstNumber);
        // formData.append('PANNumber', this.model().panNumber);
        // formData.append('TINNumber', this.model().tinNumber);
        // formData.append('VendorName', this.model().vendorName);
        // formData.append('BusinessEmail', this.model().businessEmail);
        // formData.append('BusinessPhone', this.model().businessPhone);
        // formData.append('Website', this.model().website);
        // formData.append('Description', this.description);
        // formData.append('Status', 'pending');
        // formData.append('IdentityPic', 'img');
        // formData.append('CINNumber', this.model().cinNumber);
        // formData.append('TANNumber', this.model().tanNumber);
        // formData.append('FSSAINumber', this.model().fssaiNumber);
        // formData.append('LicenseNumber', this.model().licenseNumber);

        // if (this.model().id) formData.append('Id', this.model().id);

        // formData.append('VendorType', this.vendorType);
        // formData.append('BuisnessCategory', this.vendorCategory);

        // formData.append('BankAccountNo', this.model().bankAccountNo);
        // formData.append('IFSC', this.model().ifsc);
        // formData.append('AccountHolder', this.model().accountHolder);
        // formData.append('TermCondition', this.termCondition);
        // // File upload
        // if (this.uploadedFiles) {
        //     formData.append('File', this.uploadedFiles);
        // }

        // // Address object
        // formData.append('Address.Id', this.model().address.id);
        // formData.append('Address.AddressType', this.model().address.addressType);
        // formData.append('Address.Country', this.model().address.country);
        // formData.append('Address.State', this.model().address.state);
        // formData.append('Address.City', this.model().address.city);
        // formData.append('Address.Area', this.model().address.area);
        // formData.append('Address.Pincode', this.model().address.pincode);
        // formData.append('Address.AddressLine1', this.addressLine1);
        // formData.append('Address.AddressLine2', this.addressLine2);

        // formData.append('Address.IsDefault', this.model().address.isDefault.toString());
    }

    onUpload(event: any, c: string) {
        console.log('called', event.files);
        const formData = new FormData();
        formData.append('File', event.files[0]);
        formData.append('VendorId', this.model().id);
        formData.append('T', c);
        this.service.updateVendorImage(formData).subscribe({
            next: (res: ApiResponse) => {
                console.log('post category res => ', res);
                if (res.status) {
                    this.toastService.add({
                        severity: 'Success',
                        summary: res.message
                    });
                    this.router.navigate([`${PAGE_URL.vendorDetails}`, res.data]);
                } else {
                    this.toastService.add({
                        severity: 'Error',
                        summary: res.message
                    });
                }
            },
            error: (err) => {
                console.error(err);
                this.toastService.add({
                    severity: 'Error',
                    summary: 'Somthing went wrong, please try again!'
                });
            }
        });
    }
}
