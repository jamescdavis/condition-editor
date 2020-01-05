import { module, test } from 'qunit';
import DS from 'ember-data';
import { setupTest } from 'ember-qunit';

module('Unit | Model | property value', function(hooks) {
    setupTest(hooks);

    test('holds value', function(assert) {
        const value = 'foo';
        const store = this.owner.lookup('service:store') as DS.Store;
        const propertyValue = store.createRecord('property-value', { value });
        assert.equal(propertyValue.value, value, 'value is held');
    });
});
