import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule, InputGroupAddonStyle } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';

export const SHARED_PRIM_NG_IMPORT_MODULE = [
    ToolbarModule,
    TableModule,
    DialogModule,
    CardModule,
    InputGroupModule,
    InputTextModule,
    TextareaModule,
    InputIconModule,
    SelectModule,
    IconFieldModule,
    ButtonModule,
    ConfirmDialogModule,
    InputGroupAddonModule,
    FloatLabelModule
];

export const SHARED_IMPORT_MODULE = [FormField, FormsModule];
