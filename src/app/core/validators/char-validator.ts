import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxNonSpaceCharsValidator(maxLength: number = 255): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const trimmedLength = control.value.replace(/\s/g, "").length;
    return trimmedLength > maxLength ? { maxNonSpaceChars: true } : null;
  };
}
