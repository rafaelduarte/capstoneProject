import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class CustomvalidationService {
  constructor(private utilService: UtilService) {}

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null as any;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? (null as any) : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmedPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmedPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        passwordControl.errors &&
        !confirmPasswordControl.errors?.passwordMismatch
      ) {
        return null;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return;
      } else {
        confirmPasswordControl.setErrors(null);
        return;
      }
    };
  }

  imageValidator(
    photoControl: AbstractControl
  ): { [key: string]: boolean } | null {
    if (photoControl.value) {
      const [ulploadImage] = photoControl.value.files;
      return this.utilService.validateFile(ulploadImage)
        ? null
        : { image: true };
    }
    return null;
  }
}
