import { module, test } from 'qunit';
import DS from 'ember-data';
import { setupTest } from 'ember-qunit';

module('Unit | Model | product', function(hooks) {
    setupTest(hooks);

    test('remap property values by id', function(assert) {
        const store = this.owner.lookup('service:store') as DS.Store;
        const product = store.createRecord('product', {});
        const properties = [
            store.createRecord('property', { id: 0 }),
            store.createRecord('property', { id: 1 }),
            store.createRecord('property', { id: 2 }),
        ];
        const propertyValues = [
            store.createRecord('property-value', { product, property: properties[2], value: 'foo' }),
            store.createRecord('property-value', { product, property: properties[0], value: 'bar' }),
            store.createRecord('property-value', { product, property: properties[1], value: 'baz' }),
        ];
        propertyValues.forEach(propertyValue => {
            if (propertyValue.property) {
                const {
                    property: { id },
                    value,
                } = propertyValue;
                assert.equal(product.propValsByPropId[id], value, `property ${id} remapped correctly`);
            }
        });
    });
});
