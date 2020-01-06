import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Changeset from 'ember-changeset';
import { ChangesetDef } from 'ember-changeset/types';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import Operator from 'condition-editor/lib/operator';
import PropertyModel from 'condition-editor/models/property';

export default class ConditionEditorComponent extends Component {
    @tracked property?: PropertyModel;

    @tracked operator?: Operator;

    @tracked input?: string;

    @tracked changeset!: ChangesetDef;

    @task({ restartable: true })
    updateInput = task(function*(this: ConditionEditorComponent) {
        yield timeout(500);
        if (this.changeset.isDirty) {
            this.changeset.save({});
        }
    });

    @action buildChangeset(): void {
        this.changeset = new Changeset(this) as ChangesetDef;
    }

    @action setProperty(property?: PropertyModel): void {
        this.property = property;
        this.setOperator(undefined);
    }

    @action setOperator(operator?: Operator): void {
        if (this.operator !== operator) {
            this.operator = operator;
        }
        this.setInput(undefined);
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
