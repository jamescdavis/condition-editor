import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Server } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import Ember from 'ember';

import { getOperator, Id as Op } from 'condition-editor/lib/operator';
import PropertyModel from 'condition-editor/models/property';
import ProductModel from 'condition-editor/models/product';

interface Context extends TestContext {
    server: Server;
    properties: Ember.ArrayProxy<PropertyModel>;
    products: Ember.ArrayProxy<ProductModel>;
}

module('Integration | Component | product-table', function(hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: Context) {
        this.store = this.owner.lookup('service:store');

        this.server.create('property', { id: 0, name: 'Foo' });
        this.server.create('property', { id: 1, name: 'Bar' });
        this.server.create('property', { id: 2, name: 'Baz' });

        this.properties = await this.store.findAll('property');

        this.server.create('product', { id: 0 });
        this.server.create('product', { id: 1 });
        this.server.create('product', { id: 2 });

        this.products = await this.store.findAll('product');

        this.properties.forEach(property =>
            this.products.forEach(product =>
                this.server.create('property-value', {
                    productId: parseInt(product.id, 0),
                    propertyId: parseInt(property.id, 0),
                    value: `${property.name.toLowerCase()}-${product.id}`,
                }),
            ),
        );
    });

    test('displays products', async function(this: Context, assert) {
        await render(hbs`<ProductTable @properties={{this.properties}} />`);

        assert.dom('[data-test-product-table]').exists({ count: 1 });

        this.products.forEach(product => assert.dom(`[data-test-product-row="${product.id}"]`).exists({ count: 1 }));

        this.products.forEach(product =>
            this.properties.forEach(property => {
                assert.dom(`[data-test-property-header="${property.id}"]`).exists({ count: 1 });
                assert.dom(`[data-test-property-header="${property.id}"]`).hasText(property.name);
                assert
                    .dom(`[data-test-product-row="${product.id}"] [data-test-property-value="${property.id}"]`)
                    .exists({ count: 1 });
                assert
                    .dom(`[data-test-product-row="${product.id}"] [data-test-property-value="${property.id}"]`)
                    .hasText(product.propValsByPropId[property.id].toString());
            }),
        );
    });

    test('filters products', async function(this: Context, assert) {
        const operator = getOperator(Op.Eq);
        const property = this.properties.toArray()[1];
        this.setProperties({ property, operator });

        await render(hbs`<ProductTable
            @properties={{this.properties}}
            @property={{this.property}}
            @operator={{this.operator}}
            @filter='bar-1'
        />`);

        assert.dom('[data-test-product-row="0"]').doesNotExist();
        assert.dom('[data-test-product-row="1"]').exists({ count: 1 });
        assert.dom('[data-test-product-row="2"]').doesNotExist();
    });

    test('updates product list on filter change', async function(this: Context, assert) {
        const operator = getOperator(Op.Eq);
        const property = this.properties.toArray()[1];
        this.setProperties({ property, operator, filter: 'bar-1' });

        await render(hbs`<ProductTable
            @properties={{this.properties}}
            @property={{this.property}}
            @operator={{this.operator}}
            @filter='{{this.filter}}'
        />`);

        assert.dom('[data-test-product-row="0"]').doesNotExist();
        assert.dom('[data-test-product-row="1"]').exists({ count: 1 });
        assert.dom('[data-test-product-row="2"]').doesNotExist();

        this.setProperties({ filter: 'bar-2' });
        await settled();

        assert.dom('[data-test-product-row="0"]').doesNotExist();
        assert.dom('[data-test-product-row="1"]').doesNotExist();
        assert.dom('[data-test-product-row="2"]').exists({ count: 1 });
    });

    test('updates product list on operator change', async function(this: Context, assert) {
        const operator = getOperator(Op.Eq);
        const property = this.properties.toArray()[1];
        this.setProperties({ property, operator });

        await render(hbs`<ProductTable
            @properties={{this.properties}}
            @property={{this.property}}
            @operator={{this.operator}}
            @filter='bar-1'
        />`);

        assert.dom('[data-test-product-row="0"]').doesNotExist();
        assert.dom('[data-test-product-row="1"]').exists({ count: 1 });
        assert.dom('[data-test-product-row="2"]').doesNotExist();

        this.setProperties({ operator: Op.Any });
        await settled();

        assert.dom('[data-test-product-row="0"]').exists({ count: 1 });
        assert.dom('[data-test-product-row="1"]').exists({ count: 1 });
        assert.dom('[data-test-product-row="2"]').exists({ count: 1 });
    });
});
