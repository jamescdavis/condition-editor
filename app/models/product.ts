import { computed } from '@ember/object';
import Model, { hasMany } from '@ember-data/model';

import PropertyValueModel from './property-value';

type ValsById = Record<string, string | number>;

export default class ProductModel extends Model {
    @hasMany('property-value', { inverse: 'product', async: false })
    propertyValues!: PropertyValueModel[];

    @computed('propertyValues[]')
    get propValsByPropId(): ValsById {
        return this.propertyValues.reduce((acc, propVal) => {
            if (propVal.property) {
                acc[propVal.property.id] = propVal.value;
            }
            return acc;
        }, {} as ValsById);
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        product: ProductModel;
    }
}
