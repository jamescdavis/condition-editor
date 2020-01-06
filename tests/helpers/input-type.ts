import { Id as Op } from 'condition-editor/lib/operator';
import { PropertyType } from 'condition-editor/models/property';

export enum InputType {
    None,
    Text,
    SingleSelect,
    MultiSelect,
}

type OpExpectedInputTypes = {
    [key in Op]: InputType;
};

type ExpectedInputTypes = {
    [key in PropertyType]: Partial<OpExpectedInputTypes>;
};

export const expectedInputTypes: ExpectedInputTypes = {
    [PropertyType.String]: {
        [Op.Eq]: InputType.Text,
        [Op.Any]: InputType.None,
        [Op.None]: InputType.None,
        [Op.In]: InputType.Text,
        [Op.Contains]: InputType.Text,
    },
    [PropertyType.Number]: {
        [Op.Eq]: InputType.Text,
        [Op.Gt]: InputType.Text,
        [Op.Lt]: InputType.Text,
        [Op.Any]: InputType.None,
        [Op.None]: InputType.None,
        [Op.In]: InputType.Text,
    },
    [PropertyType.Enumer]: {
        [Op.Eq]: InputType.SingleSelect,
        [Op.Any]: InputType.None,
        [Op.None]: InputType.None,
        [Op.In]: InputType.MultiSelect,
    },
};

export function assertsForInputType(assert: Assert, inputType?: InputType): void {
    switch (inputType) {
        case InputType.None:
            assert.dom('[data-test-input-box] [data-test-input]').doesNotExist();
            assert.dom('[data-test-input-box] .ember-power-select-trigger').doesNotExist();
            assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').doesNotExist();
            break;
        case InputType.Text:
            assert.dom('[data-test-input-box] [data-test-input]').exists({ count: 1 });
            assert.dom('[data-test-input-box] .ember-power-select-trigger').doesNotExist();
            assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').doesNotExist();
            break;
        case InputType.SingleSelect:
            assert.dom('[data-test-input-box] [data-test-input]').doesNotExist();
            assert.dom('[data-test-input-box] .ember-power-select-trigger').exists({ count: 1 });
            assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').doesNotExist();
            break;
        case InputType.MultiSelect:
            assert.dom('[data-test-input-box] [data-test-input]').doesNotExist();
            assert.dom('[data-test-input-box] .ember-power-select-trigger').exists({ count: 1 });
            assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').exists({ count: 1 });
            break;
        default:
    }
}
