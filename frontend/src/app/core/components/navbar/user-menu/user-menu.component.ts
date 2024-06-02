import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../modules/auth/services/auth.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent implements OnInit {
  profileLetter: string = ''
  username: string = ''

  constructor(public authService: AuthService, public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: user => {
        this.username = user.body?.username ?? ''
        this.profileLetter = this.username.length > 0 ? this.username.charAt(0).toUpperCase() : ''
      }
    })
  }

  signout() {
    this.authService.signout().subscribe()
    this.authService.setAuthStatus(false)
  }
}
