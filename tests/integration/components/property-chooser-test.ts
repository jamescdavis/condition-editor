import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext } from 'ember-test-helpers';

interface Property {
    id: string;
    name: string;
}

interface Context extends TestContext {
    selectedProperty: Property;
}

module('Integration | Component | property-chooser', function(hooks) {
    setupRenderingTest(hooks);

    test('chooses properties', async function(this: Context, assert) {
        const properties: Property[] = [
            { id: '0', name: 'Foo' },
            { id: '1', name: 'Bar' },
            { id: '2', name: 'Baz' },
        ];

        const onChange = (property: Property): void => {
            this.selectedProperty = property;
        };

        this.setProperties({ properties, onChange });

        await render(hbs`<PropertyChooser
            @properties={{this.properties}}
            @selected={{this.selectedProperty}}
            @onChange={{this.onChange}}
        />`);

        assert.strictEqual(this.selectedProperty, undefined, 'initial');

        for (let i = 0; i < properties.length; i++) {
            await click('.ember-power-select-trigger');
            await click(`[data-test-property-chooser="${i}"]`);
            assert.strictEqual(this.selectedProperty, properties[i], properties[i].name);
        }
    });
});
