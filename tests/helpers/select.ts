import { click } from '@ember/test-helpers';

import { Id as Op } from 'condition-editor/lib/operator';
import PropertyModel from 'condition-editor/models/property';

export async function selectProperty(property: PropertyModel): Promise<void> {
    await click('[data-test-property-chooser-box] .ember-power-select-trigger');
    await click(`[data-test-property-chooser="${property.id}"]`);
}

export async function selectOperator(operator: Op): Promise<void> {
    await click('[data-test-operator-chooser-box] .ember-power-select-trigger');
    await click(`[data-test-operator-chooser="${operator}"]`);
}
