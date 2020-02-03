import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Changeset from 'ember-changeset';
import { ChangesetDef } from 'ember-changeset/types';
import lookupValidator from 'ember-changeset-validations';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import Operator, { Id as Op } from 'condition-editor/lib/operator';
import PropertyModel, { PropertyType } from 'condition-editor/models/property';
import validationsMap from 'condition-editor/validations/input';
import config from 'condition-editor/config/environment';

export default class ConditionEditorComponent extends Component {
    @tracked property?: PropertyModel;

    @tracked operator?: Operator;

    @tracked input?: string;

    @tracked changeset!: ChangesetDef;

    @task({ restartable: true })
    updateInput = task(function*(this: ConditionEditorComponent) {
        yield timeout(config.environment === 'test' ? 0 : 500);
        if (this.changeset.isDirty && !this.changeset.isInvalid) {
            this.changeset.save({});
        }
    });

    buildChangeset(): void {
        if (this.property && this.operator) {
            const opValidations = validationsMap[this.property.type];
            if (opValidations) {
                let validations = opValidations.default;
                if (this.operator.id in opValidations) {
                    validations = opValidations[this.operator.id];
                }
                if (validations) {
                    this.changeset = new Changeset(this, lookupValidator(validations), validations) as ChangesetDef;
                    return;
                }
            }
        }
        this.changeset = new Changeset(this) as ChangesetDef;
    }

    get inputType(): string {
        return this.property?.type === PropertyType.Number &&
            this.operator &&
            [Op.Eq, Op.Gt, Op.Lt].includes(this.operator.id)
            ? 'number'
            : 'text';
    }

    @action setProperty(property?: PropertyModel): void {
        this.property = property;
        this.setOperator(undefined);
    }

    @action setOperator(operator?: Operator): void {
        this.operator = operator;
        this.setInput(undefined);
        if (operator && operator.needsInput) {
            this.buildChangeset();
        }
    }

    @action setInput(input?: string): void {
        this.updateInput.cancelAll();
        if (this.input !== input) {
            this.input = input;
        }
    }

    @action clear(): void {
        this.input = undefined;
        this.operator = undefined;
        this.property = undefined;
    }
}
