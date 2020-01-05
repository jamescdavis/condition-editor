import { Server, Collection } from 'ember-cli-mirage';
import PropertyValue from 'condition-editor/models/property-value';
import { Id as OpId, getOperator } from 'condition-editor/lib/operator';

function isOpId(value: string): value is OpId {
    return Object.values(OpId).includes(value as OpId);
}

export default function(this: Server): void {
    this.get('/properties');

    this.get('/products', function(schema, request) {
        const { property, operator, filter } = request.queryParams;
        if (property && operator) {
            const filteredProducts = schema.products.all().filter(function(product) {
                const propertyValues = product.propertyValues.filter(function(propertyValue) {
                    if (propertyValue.property) {
                        return propertyValue.property.id === property;
                    }
                    return false;
                });
                let value;
                if (propertyValues.models.length > 0) {
                    value = propertyValues.models[0].value;
                }
                if (isOpId(operator)) {
                    const oper = getOperator(operator);
                    if (oper.needsInput && !filter) {
                        return true;
                    }
                    return oper.compare(value, filter);
                }
                return false;
            });
            return filteredProducts;
        }
        return schema.products.all();
    });
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        products: {
            propertyValues: Collection<PropertyValue>;
        };
    }
}
