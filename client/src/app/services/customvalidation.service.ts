import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomvalidationService {
  constructor() {}

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
}
