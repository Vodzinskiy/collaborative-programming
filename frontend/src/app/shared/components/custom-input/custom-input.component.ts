import {booleanAttribute, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styles: [
    `mat-form-field {
      min-width: 400px;
      margin: 5px 0;
    }
    .has-error .mat-form-field-underline {
      background-color: red;
    }`
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() requiredErrorMessage: string = 'Це поле є обов\'язковим';
  @Input({transform: booleanAttribute}) isPassword: boolean = false;
  @Input() control!: FormControl
  showPassword: boolean = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  set value(val: any) {
    this.onChange(val);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
