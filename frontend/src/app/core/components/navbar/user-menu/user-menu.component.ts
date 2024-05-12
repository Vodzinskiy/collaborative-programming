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
  userName: string = ''

  constructor(public authService: AuthService, public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser()
    this.userService.user$.subscribe({
      next: user => {
        this.userName = user?.username ?? ''
        this.profileLetter = this.userName.length > 0 ? this.userName.charAt(0).toUpperCase() : ''
      }
    })
    /*this.userName = this.authService.user?.username ?? ''
    this.profileLetter = this.userName.length > 0 ? this.userName.charAt(0).toUpperCase() : ''*/
  }

  signout() {
    this.authService.signout().subscribe()
    this.authService.setAuthStatus(false)
  }
}
