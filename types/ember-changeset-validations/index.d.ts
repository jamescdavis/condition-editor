import { ValidatorAction, ValidatorMapFunc } from 'ember-changeset/types';

export type ValidationObject<M> = {
    [F in keyof M]?: ValidatorMapFunc;
};

export default function lookupValidator<M>(validator: ValidationObject<M>): ValidatorAction;
