import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
@Component({
    selector: 'app-toast',
    imports: [CommonModule, ToastModule, ButtonModule, InputTextModule, MessageModule, FormsModule],
    templateUrl: './toast.html',
    styleUrl: './toast.scss'
})
export class Toast {}
