import { set } from '@ember/object';

import { getOperator } from 'condition-editor/lib/operator';

export function initialize(): void {
    window.datastore.getOperators().forEach(operator => {
        set(getOperator(operator.id), 'text', operator.text);
    });
}

export default {
    initialize,
};
