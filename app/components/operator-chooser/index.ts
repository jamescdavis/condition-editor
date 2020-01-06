import Component from '@glimmer/component';

import PropertyModel, { operatorMap } from 'condition-editor/models/property';
import Operator, { getOperator } from 'condition-editor/lib/operator';

interface Args {
    property?: PropertyModel;
}

export default class OperatorChooserComponent extends Component<Args> {
    get opsForProp(): Operator[] | undefined {
        if (this.args.property) {
            return operatorMap[this.args.property.type].map(opId => getOperator(opId));
        }
        return undefined;
    }
}
