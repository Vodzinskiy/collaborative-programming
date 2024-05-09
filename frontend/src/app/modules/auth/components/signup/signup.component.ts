import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthService} from "../../services/auth.service";
import {User} from "../../../../core/models/user.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private authService: AuthService) {}

  getControl(name: string): FormControl {
    return this.signupForm.get(name) as FormControl;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const user: User = {
        username: this.signupForm.get('name')?.value || '',
        email: this.signupForm.get('email')?.value || '',
        password: this.signupForm.get('password')?.value || ''
      };
      this.authService.signup(user).subscribe(
        () => this.router.navigate(['/'])
      );
    }
  }
}
