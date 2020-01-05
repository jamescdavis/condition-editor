import Model, { attr, belongsTo } from '@ember-data/model';
import ProductModel from './product';
import PropertyModel from './property';

export default class PropertyValueModel extends Model {
    @attr() value!: string | number;

    @belongsTo('product', { inverse: 'propertyValues', async: false })
    product?: ProductModel;

    @belongsTo('property', { inverse: null, async: false })
    property?: PropertyModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'property-value': PropertyValueModel;
    }
}
