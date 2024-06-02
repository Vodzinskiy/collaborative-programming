import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../core/services/user.service";
import {Router} from "@angular/router";
import {User} from "../../core/models/user.dto";
import {AuthService} from "../auth/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "./delete-dialog.component";
import {ProjectService} from "../../core/services/project.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('', Validators.email),
    password: new FormControl('')
  });

  constructor(public userService: UserService, private router: Router, private authService: AuthService,  private dialog: MatDialog, private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: user => {
        this.profileForm.patchValue({
          username: user.body?.username ?? '',
          email: user.body?.email ?? ''
        });
      }
    });
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser().subscribe();
        let id = this.projectService.projectSubject.value?.id
        if (id) {
          this.projectService.leaveProject(id)
        }
        this.authService.setAuthStatus(false)
        void this.router.navigate(['/']);
      }
    });
  }

  save() {
    const updatedUser: User = {
      ...(this.profileForm.value.username?.trim() && {username: this.profileForm.value.username.trim()}),
      ...(this.profileForm.value.email?.trim() && {email: this.profileForm.value.email.trim()}),
      ...(this.profileForm.value.password?.trim() && {password: this.profileForm.value.password.trim()})
    };
    if (Object.values(updatedUser).some(value => value !== undefined)) {
      this.userService.updateUser(updatedUser).subscribe({
        next: () => void this.router.navigate(['/']),
        error: () => {
          this.profileForm.controls.email.setErrors({'exists': true});
        }
      });
    }
  }
}
