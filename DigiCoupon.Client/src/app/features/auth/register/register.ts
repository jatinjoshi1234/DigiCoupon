import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';
import { NgClass } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../auth-service';
import { MessageModule } from 'primeng/message';
import { PAGE } from '@/app/core/constants';
import { Toast, ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormField, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, MessageModule, ToastModule],
    templateUrl: './register.html',
    styleUrl: './register.scss',
    providers: [MessageService]
})
export class Register {
    service = inject(MessageService);
    authService = inject(AuthService);
    router = inject(Router);
    model = signal({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        mobileNo: '',
        password: '',
        confirmPassword: ''
    });
    showPassword = false;
    submitted = false;
    registerForm = form(this.model, (x) => {
        (required(x.firstName, { message: 'First name is required' }),
            required(x.middleName, { message: 'middle name is required' }),
            required(x.email, { message: 'Email is required' }),
            required(x.mobileNo, { message: 'Mobile no is required' }),
            required(x.password, { message: 'Password is required' }),
            required(x.confirmPassword, { message: 'confirm password is required' }),
            validate(x.confirmPassword, ({ value, valueOf }) => {
                return value() === valueOf(x.password)
                    ? null
                    : {
                          kind: 'passwordMismatch',
                          message: 'Passwords do not match'
                      };
            }));
    });

    submit() {
        this.authService.register(this.model()).subscribe({
            next: (res: any) => {
                console.log('res.isSuccess => ', res);
                if (res.status) {
                    this.service.add({ severity: 'success', summary: res.message, detail: 'Sucees' });
                    this.router.navigate([PAGE.login]);
                } else {
                    this.service.add({ severity: 'error', summary: res.message, detail: 'Error' });
                }
            }
        });
    }
}
