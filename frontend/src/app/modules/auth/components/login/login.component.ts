import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {User} from "../../../../core/models/user.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private authService: AuthService) {}

  getControl(name: string): FormControl {
    return this.signinForm.get(name) as FormControl;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      const user: User = {
        email: this.signinForm.get('email')?.value || '',
        password: this.signinForm.get('password')?.value || ''
      };
      this.authService.signin(user).subscribe(
        () => this.router.navigate(['/'])
      );
    }
  }
}
