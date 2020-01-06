import { ValidatorMapFunc } from 'ember-changeset/types';
import { validateFormat } from 'ember-changeset-validations/validators';

import { Id as Op } from 'condition-editor/lib/operator';
import { PropertyType } from 'condition-editor/models/property';

type OpValidationMap = {
    [op in Op]: undefined | { input: ValidatorMapFunc };
};

type ValidationsMap = {
    [propertyType in PropertyType]: {
        default: undefined | { input: ValidatorMapFunc };
    } & Partial<OpValidationMap>;
};

const validationsMap: Partial<ValidationsMap> = {
    [PropertyType.String]: {
        default: undefined,
        [Op.In]: {
            input: validateFormat({
                regex: /^[^,]*[^\s,][^,]*(,[^,]*[^\s,][^,]*)*$/,
                message: 'Must be a comma-separated list',
            }),
        },
    },
    [PropertyType.Number]: {
        default: undefined,
        [Op.In]: {
            input: validateFormat({
                regex: /^\s*\d+(\.\d+)?\s*(,?\s*\d+(\.\d+)?\s*)*$/,
                message: 'Must be a comma-separated list of numbers',
            }),
        },
    },
};

export default validationsMap;
