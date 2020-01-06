import { module, test } from 'qunit';
import { visit, fillIn, triggerKeyEvent, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { Server } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import Ember from 'ember';

import { loadProperties, loadProducts } from 'condition-editor/mirage/util';
import { selectProperty, selectOperator } from 'condition-editor/tests/helpers/select';
import PropertyModel from 'condition-editor/models/property';
import { Id as Op } from 'condition-editor/lib/operator';

interface Context extends TestContext {
    server: Server;
    properties: Ember.ArrayProxy<PropertyModel>;
    chooseProperty: (name: string) => void;
}

async function input(value: string): Promise<void> {
    await fillIn('[data-test-input]', value);
    await triggerKeyEvent('[data-test-input]', 'keydown', 'ENTER');
}

module('Acceptance | application', function(hooks) {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: Context) {
        loadProperties(this.server);
        loadProducts(this.server);

        this.store = this.owner.lookup('service:store');
        this.properties = await this.store.findAll('property');

        this.chooseProperty = async (name: string): Promise<void> => {
            const list = this.properties.toArray().filter(property => property.name === name);
            if (list.length > 0) {
                await selectProperty(list[0]);
            }
        };
    });

    test('visiting /', async function(this: Context, assert) {
        await visit('/');

        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await this.chooseProperty('Product Name');

        await selectOperator(Op.Eq);

        await input('Cell Phone');
        assert.dom('[data-test-product-row]').exists({ count: 1 });
        assert.dom('[data-test-product-row]').containsText('Cell Phone');

        await input('Key');
        assert.dom('[data-test-product-row]').exists({ count: 1 });
        assert.dom('[data-test-product-row]').containsText('Key');

        await selectOperator(Op.Any);
        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await selectOperator(Op.None);
        assert.dom('[data-test-product-row]').doesNotExist();

        await selectOperator(Op.In);

        await input('Key');
        assert.dom('[data-test-product-row]').exists({ count: 1 });
        assert.dom('[data-test-product-row]').containsText('Key');

        await input('Key, Cup');
        assert.dom('[data-test-product-row]').exists({ count: 2 });

        await input(', Key');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-validation-messages]').hasAnyText();

        await input('Key,');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-validation-messages]').hasAnyText();

        await input('Key,,Cup');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-validation-messages]').hasAnyText();

        await selectOperator(Op.Contains);

        await input('key');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-product-row]').containsText('Key');

        await click('[data-test-clear-button]');
        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await this.chooseProperty('weight (oz)');

        await selectOperator(Op.Eq);

        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await input('3');
        assert.dom('[data-test-product-row]').exists({ count: 2 });

        await input('19');
        assert.dom('[data-test-product-row]').exists({ count: 1 });
        assert.dom('[data-test-product-row]').containsText('Hammer');

        await input('1.0');
        assert.dom('[data-test-product-row]').exists({ count: 1 });
        assert.dom('[data-test-product-row]').containsText('Key');

        await selectOperator(Op.Gt);

        await input('0');
        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await input('1');
        assert.dom('[data-test-product-row]').exists({ count: 5 });

        await input('0.9');
        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await selectOperator(Op.Lt);

        await input('0');
        assert.dom('[data-test-product-row]').exists({ count: 0 });

        await input('5');
        assert.dom('[data-test-product-row]').exists({ count: 3 });

        await input('0.9');
        assert.dom('[data-test-product-row]').exists({ count: 0 });

        await input('10');
        assert.dom('[data-test-product-row]').exists({ count: 5 });

        await selectOperator(Op.Any);
        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await selectOperator(Op.None);
        assert.dom('[data-test-product-row]').exists({ count: 0 });

        await selectOperator(Op.In);

        await input('19');
        assert.dom('[data-test-product-row]').exists({ count: 1 });
        assert.dom('[data-test-product-row]').containsText('Hammer');

        await input('1, 19');
        assert.dom('[data-test-product-row]').exists({ count: 2 });

        await input('1, a, 5');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-validation-messages]').hasAnyText();

        await input('1, ,5');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-validation-messages]').hasAnyText();

        await input(',1,5');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-validation-messages]').hasAnyText();

        await input('1,5,');
        assert.dom('[data-test-product-row]').exists({ count: 2 });
        assert.dom('[data-test-validation-messages]').hasAnyText();

        await this.chooseProperty('wireless');

        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await selectOperator(Op.Eq);

        assert.dom('[data-test-product-row]').exists({ count: 6 });

        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-single-select-input="true"]');
        assert.dom('[data-test-product-row]').exists({ count: 1 });

        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-single-select-input="false"]');
        assert.dom('[data-test-product-row]').exists({ count: 2 });

        await selectOperator(Op.Any);
        assert.dom('[data-test-product-row]').exists({ count: 3 });

        await selectOperator(Op.None);
        assert.dom('[data-test-product-row]').exists({ count: 3 });

        await selectOperator(Op.In);

        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-multi-select-input="true"]');
        assert.dom('[data-test-product-row]').exists({ count: 1 });

        await click('[data-test-input-box] .ember-power-select-trigger');
        await click('[data-test-multi-select-input="false"]');
        assert.dom('[data-test-product-row]').exists({ count: 3 });
    });
});
