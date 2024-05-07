import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../modules/auth/services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  firstLetter: string = "A";
  projectName: string = "projectName";
  isLoading = true;

  testName = ["test1", "test2", "test3"]

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.authenticated()
  }

  authenticated() {
    this.authService.checkAuthStatus().subscribe({
        next: ()=> this.isLoading = false,
        error: ()=> this.isLoading = false
      }
    );
  }

  signout() {
    this.authService.signout().subscribe()
    this.authService.setAuthStatus(false)
  }
}
