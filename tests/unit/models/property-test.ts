import { module, test } from 'qunit';
import DS from 'ember-data';
import { setupTest } from 'ember-qunit';

import { PropertyType } from 'condition-editor/models/property';

module('Unit | Model | property', function(hooks) {
    setupTest(hooks);

    test('string property', function(assert) {
        const name = 'String Property';
        const type = PropertyType.String;
        const store = this.owner.lookup('service:store') as DS.Store;
        const property = store.createRecord('property', { name, type });
        assert.equal(property.name, name, `property name is ${name}`);
        assert.equal(property.type, type, `property is of type: ${type}`);
        assert.notOk(property.isEnumerated, 'property is *not* enumerated');
    });

    test('number property', function(assert) {
        const name = 'Number Property';
        const type = PropertyType.Number;
        const store = this.owner.lookup('service:store') as DS.Store;
        const property = store.createRecord('property', { name, type });
        assert.equal(property.name, name, `property name is ${name}`);
        assert.equal(property.type, type, `property is of type: ${type}`);
        assert.notOk(property.isEnumerated, 'property is *not* enumerated');
    });

    test('enumerated property', function(assert) {
        const name = 'Enumerated Property';
        const type = PropertyType.Enumer;
        const store = this.owner.lookup('service:store') as DS.Store;
        const property = store.createRecord('property', { name, type });
        assert.equal(property.name, name, `property name is ${name}`);
        assert.equal(property.type, type, `property is of type: ${type}`);
        assert.ok(property.isEnumerated, 'property *is* enumerated');
    });
});
