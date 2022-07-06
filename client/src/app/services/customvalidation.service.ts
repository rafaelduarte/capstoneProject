import { invalid } from '@angular/compiler/src/render3/view/util';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthenticationService } from '../auth/authentication.service';
import { UtilService } from './util.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomvalidationService {
  constructor(private utilService: UtilService) {}

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null as any;
      }

      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const hasCharacterLength = RegExp('^([a-zA-Z0-9]).{7,}$').test(value);
      const hasNumeric = RegExp('[0-9]').test(value);
      const hasSpecialCharacter = RegExp('[!@#$%&*+._-]').test(value);
      const hasUppercase = RegExp('[A-Z]').test(value);
      const hasLowercase = RegExp('[a-z]').test(value);
      // const valid = regex.test(control.value);

      let errors: ValidationErrors = {};
      //Special Characters !@#$%&_-.=
      if (!hasSpecialCharacter) {
        errors['noSpecialCharacterError'] = true;
      }

      //Uppercase Character [A-Z]
      if (!hasUppercase) {
        errors['noUppercaseCharacterError'] = true;
      }

      //Lowercase Character [a-z]
      if (!hasLowercase) {
        errors['noLowercaseCharacterError'] = true;
      }

      //Number [0-9]
      if (!hasNumeric) {
        errors['noNumberError'] = true;
      }

      //Minimum Characters Limit >=8
      if (!hasCharacterLength) {
        errors['minimumCharacterError'] = true;
      }

      const isValid =
        hasUppercase &&
        hasLowercase &&
        hasNumeric &&
        hasSpecialCharacter &&
        hasCharacterLength;

      //console.log(errors);
      return isValid ? (null as any) : errors;
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

  emailExistsValidator(user: AuthenticationService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return user
        .findUserByEmail(control.value)
        .pipe(
          map((result: any) =>
            result.length ? { emailAlreadyExists: true } : null
          )
        );
    };
  }

  usernameExistsValidator(user: AuthenticationService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return user
        .findUserByUsername(control.value)
        .pipe(
          map((result: any) =>
            result.length ? { usernameAlreadyExists: true } : null
          )
        );
    };
  }
}
