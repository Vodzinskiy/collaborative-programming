import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Підтвердження видалення</h2>
    <div mat-dialog-content>
      <p>Ви впевнені, що хочете видалити свій акаунт?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Скасувати</button>
      <button mat-button [mat-dialog-close]="true" color="warn">Видалити</button>
    </div>
  `
})
export class DeleteDialogComponent {}
