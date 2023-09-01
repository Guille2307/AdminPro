import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarPassword: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmarPassword = control.get('password2');
  return password?.value === confirmarPassword?.value
    ? null
    : { noSonIguales: true };
};
