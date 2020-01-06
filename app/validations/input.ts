import { ValidatorMapFunc } from 'ember-changeset/types';

import { Id as Op } from 'condition-editor/lib/operator';
import { PropertyType } from 'condition-editor/models/property';
import validateList from 'condition-editor/validators/list';
import validateNumberList from 'condition-editor/validators/number-list';

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
            input: validateList(),
        },
    },
    [PropertyType.Number]: {
        default: undefined,
        [Op.In]: {
            input: validateNumberList(),
        },
    },
};

export default validationsMap;
