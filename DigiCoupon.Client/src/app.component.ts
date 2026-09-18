import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    template: `<p-toast></p-toast><p-confirmdialog [style]="{ width: '450px' }" /><router-outlet></router-outlet>`
})
export class AppComponent {}
