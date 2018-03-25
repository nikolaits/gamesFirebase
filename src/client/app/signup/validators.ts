import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl,NG_VALIDATORS, Validator }   from '@angular/forms';
 export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {
        [key: string]: any
    } => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
            return {
                mismatchedPasswords: true
            };
        }
        return null;
    }
}