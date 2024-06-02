import {Component} from '@angular/core';
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

  constructor(private authService: AuthService, private router: Router) {
  }

  getControl(name: string): FormControl {
    return this.signinForm.get(name) as FormControl;
  }

  onSubmit() {
    const user: User = {
      email: this.signinForm.get('email')?.value || '',
      password: this.signinForm.get('password')?.value || ''
    };
    this.authService.signin(user).subscribe({
      next: () => {
        void this.router.navigate(['/'])
      },
      error: err => {
        if (err.status === 401) {
          this.signinForm.controls.email.setErrors({'incorrect': true})
          this.signinForm.controls.password.setErrors({'incorrect': true})
        }
      }
    });
  }
}
