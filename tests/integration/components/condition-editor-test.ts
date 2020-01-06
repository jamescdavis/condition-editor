import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';

import { Id as Op } from 'condition-editor/lib/operator';
import PropertyModel, { PropertyType, operatorMap } from 'condition-editor/models/property';
import { InputType, expectedInputTypes, assertsForInputType } from 'condition-editor/tests/helpers/input-type';
import { selectProperty, selectOperator } from 'condition-editor/tests/helpers/select';

interface Context extends TestContext {
    properties: PropertyModel[];
}

module('Integration | Component | condition-editor', function(hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: Context, assert) {
        this.store = this.owner.lookup('service:store');

        this.properties = [
            this.store.createRecord('property', { id: 0, name: 'Foo', type: PropertyType.String }),
            this.store.createRecord('property', { id: 1, name: 'Bar', type: PropertyType.Number }),
            this.store.createRecord('property', {
                id: 2,
                name: 'Baz',
                type: PropertyType.Enumer,
                values: ['foo', 'bar', 'baz'],
            }),
        ];

        await render(hbs`
            <ConditionEditor @properties={{this.properties}} as |ce|>
                <span data-test-selected-property={{ce.property.id}}>{{ce.property.name}}</span>
                <span data-test-selected-operator={{ce.operator.id}}>{{ce.operator.text}}</span>
                <span data-test-input-value>{{ce.input}}</span>
            </ConditionEditor>
        `);

        assert.dom('[data-test-condition-editor]').exists({ count: 1 });
        assert.dom('[data-test-operator-chooser-box] .ember-power-select-trigger').doesNotExist();
        assertsForInputType(assert, InputType.None);
    });

    test('correct input type for prop and operator', async function(this: Context, assert) {
        for (let p = 0; p < this.properties.length; p++) {
            await selectProperty(this.properties[p]);
            assert.dom(`[data-test-selected-property="${this.properties[p].id}"]`).exists({ count: 1 });
            assert.dom('[data-test-operator-chooser-box] .ember-power-select-trigger').exists({ count: 1 });
            assertsForInputType(assert, InputType.None);

            const operators = operatorMap[this.properties[p].type];

            for (let o = 0; o < operators.length; o++) {
                await selectOperator(operators[o]);
                assert.dom(`[data-test-selected-operator="${operators[o]}"]`).exists({ count: 1 });
                assertsForInputType(assert, expectedInputTypes[this.properties[p].type][operators[o]]);
            }
        }
    });

    test('values yielded correctly', async function(this: Context, assert) {
        await selectProperty(this.properties[0]);
        assert.dom('[data-test-selected-property="0"]').exists({ count: 1 });
        await selectOperator(Op.Eq);
        assert.dom(`[data-test-selected-operator="${Op.Eq}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.Text);
        await fillIn('[data-test-input]', 'foo');
        await triggerKeyEvent('[data-test-input]', 'keydown', 'ENTER');
        assert.dom('[data-test-input-value]').hasText('foo');

        await selectProperty(this.properties[2]);
        assert.dom('[data-test-selected-property="2"]').exists({ count: 1 });
        await selectOperator(Op.Eq);
        assert.dom(`[data-test-selected-operator="${Op.Eq}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.SingleSelect);
        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-single-select-input="bar"]');
        assert.dom('[data-test-input-value]').hasText('bar');

        await selectOperator(Op.In);
        assert.dom(`[data-test-selected-operator="${Op.In}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.MultiSelect);
        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-multi-select-input="foo"]');
        assert.dom('[data-test-input-value]').hasText('foo');

        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-multi-select-input="bar"]');
        assert.dom('[data-test-input-value]').hasText('foo,bar');

        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-multi-select-input="baz"]');
        assert.dom('[data-test-input-value]').hasText('foo,bar,baz');
    });

    test('clear button clears', async function(this: Context, assert) {
        await selectProperty(this.properties[0]);
        assert.dom('[data-test-selected-property="0"]').exists({ count: 1 });
        await selectOperator(Op.Eq);
        assert.dom(`[data-test-selected-operator="${Op.Eq}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.Text);
        await fillIn('[data-test-input]', 'foo');
        await triggerKeyEvent('[data-test-input]', 'keydown', 'ENTER');
        assert.dom('[data-test-input-value]').hasText('foo');

        await click('[data-test-clear-button]');

        assert.dom('[data-test-operator-chooser-box] .ember-power-select-trigger').doesNotExist();
        assertsForInputType(assert, InputType.None);
        assert.dom('[data-test-selected-property]').doesNotExist();
        assert.dom('[data-test-selected-operator]').doesNotExist();
        assert.dom('[data-test-input-value]').hasNoText();
    });

    test('changing operators clears input', async function(this: Context, assert) {
        await selectProperty(this.properties[0]);
        assert.dom('[data-test-selected-property="0"]').exists({ count: 1 });
        await selectOperator(Op.Eq);
        assert.dom(`[data-test-selected-operator="${Op.Eq}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.Text);
        await fillIn('[data-test-input]', 'foo');
        await triggerKeyEvent('[data-test-input]', 'keydown', 'ENTER');
        assert.dom('[data-test-input-value]').hasText('foo');

        await selectOperator(Op.Contains);

        assert.dom(`[data-test-selected-operator="${Op.Contains}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.Text);
        assert.dom('[data-test-input-value]').hasNoText();
    });

    test('changing properties resets operator and clears input', async function(this: Context, assert) {
        await selectProperty(this.properties[0]);
        assert.dom('[data-test-selected-property="0"]').exists({ count: 1 });
        await selectOperator(Op.Eq);
        assert.dom(`[data-test-selected-operator="${Op.Eq}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.Text);
        await fillIn('[data-test-input]', 'foo');
        await triggerKeyEvent('[data-test-input]', 'keydown', 'ENTER');
        assert.dom('[data-test-input-value]').hasText('foo');

        await selectProperty(this.properties[1]);

        assert.dom('[data-test-input-value]').hasNoText();
        assert.dom('[data-test-selected-operator]').doesNotExist();
        assertsForInputType(assert, InputType.None);

        await selectOperator(Op.Eq);

        assert.dom(`[data-test-selected-operator="${Op.Eq}"]`).exists({ count: 1 });
        assertsForInputType(assert, InputType.Text);
        assert.dom('[data-test-input-value]').hasNoText();
    });
});
