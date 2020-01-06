import { ValidatorMapFunc, ValidationResult } from 'ember-changeset/types';

export interface Options {
    message: string;
}

export default function validateNumberList(options: Partial<Options> = {}): ValidatorMapFunc {
    return (_key, newValue): ValidationResult => {
        let newValueList = [];
        if (Array.isArray(newValue)) {
            newValueList = newValue;
        } else if (typeof newValue === 'string') {
            if (newValue.trim() === '') {
                return true;
            }
            newValueList = newValue.replace(/^\s*,\s*|\s*,\s*$/g, '').split(',');
        } else if (typeof newValue === 'number') {
            newValueList = [newValue];
        }
        if (newValueList.length > 0 && newValueList.any(value => Number.isNaN(parseFloat(value)))) {
            return options.message || 'Must be a list of numbers';
        }
        return true;
    };
}
