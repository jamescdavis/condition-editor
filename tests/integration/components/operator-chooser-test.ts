import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext } from 'ember-test-helpers';

import Operator, { getOperator, Id as Op } from 'condition-editor/lib/operator';
import PropertyModel, { PropertyType, operatorMap } from 'condition-editor/models/property';

interface Context extends TestContext {
    selectedOperator?: Operator;
    property: PropertyModel;
    onChange: (operator: Operator) => void;
}

module('Integration | Component | operator-chooser', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: Context) {
        this.store = this.owner.lookup('service:store');

        this.onChange = (operator: Operator): void => {
            this.set('selectedOperator', operator);
        };
    });

    test('chooses operators for string properties', async function(this: Context, assert) {
        this.set('property', this.store.createRecord('property', { type: PropertyType.String }));

        await render(hbs`<OperatorChooser
            @property={{this.property}}
            @operator={{this.selectedOperator}}
            @onChange={{this.onChange}}
        />`);

        assert.strictEqual(this.selectedOperator, undefined, 'initial');

        const operators = operatorMap[PropertyType.String];

        for (let i = 0; i < operators.length; i++) {
            await click('.ember-power-select-trigger');
            await click(`[data-test-operator-chooser="${operators[i]}"]`);
            assert.strictEqual(this.selectedOperator?.id, operators[i], `choose: ${getOperator(operators[i]).text}`);
        }

        await click('.ember-power-select-trigger');
        assert.dom(`[data-test-operator-chooser="${Op.Gt}"]`).doesNotExist(`not available: ${getOperator(Op.Gt).text}`);
        assert.dom(`[data-test-operator-chooser="${Op.Lt}"]`).doesNotExist(`not available: ${getOperator(Op.Lt).text}`);
    });

    test('chooses operators for number properties', async function(this: Context, assert) {
        this.set('property', this.store.createRecord('property', { type: PropertyType.Number }));

        await render(hbs`<OperatorChooser
            @property={{this.property}}
            @operator={{this.selectedOperator}}
            @onChange={{this.onChange}}
        />`);

        assert.strictEqual(this.selectedOperator, undefined, 'initial');

        const operators = operatorMap[PropertyType.Number];

        for (let i = 0; i < operators.length; i++) {
            await click('.ember-power-select-trigger');
            await click(`[data-test-operator-chooser="${operators[i]}"]`);
            assert.strictEqual(this.selectedOperator?.id, operators[i], `choose: ${getOperator(operators[i]).text}`);
        }

        await click('.ember-power-select-trigger');
        assert
            .dom(`[data-test-operator-chooser="${Op.Contains}"]`)
            .doesNotExist(`not available: ${getOperator(Op.Contains).text}`);
    });

    test('chooses operators for enumerated properties', async function(this: Context, assert) {
        this.set('property', this.store.createRecord('property', { type: PropertyType.Enumer }));

        await render(hbs`<OperatorChooser
            @property={{this.property}}
            @operator={{this.selectedOperator}}
            @onChange={{this.onChange}}
        />`);

        assert.strictEqual(this.selectedOperator, undefined, 'initial');

        const operators = operatorMap[PropertyType.Enumer];

        for (let i = 0; i < operators.length; i++) {
            await click('.ember-power-select-trigger');
            await click(`[data-test-operator-chooser="${operators[i]}"]`);
            assert.strictEqual(this.selectedOperator?.id, operators[i], `choose: ${getOperator(operators[i]).text}`);
        }

        await click('.ember-power-select-trigger');
        assert.dom(`[data-test-operator-chooser="${Op.Gt}"]`).doesNotExist(`not available: ${getOperator(Op.Gt).text}`);
        assert.dom(`[data-test-operator-chooser="${Op.Lt}"]`).doesNotExist(`not available: ${getOperator(Op.Lt).text}`);
        assert
            .dom(`[data-test-operator-chooser="${Op.Contains}"]`)
            .doesNotExist(`not available: ${getOperator(Op.Contains).text}`);
    });
});
