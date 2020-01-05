import { Server } from 'ember-cli-mirage';
import PropertyValueModel from 'condition-editor/models/property-value';

export function loadProperties(server: Server): void {
    const properties = window.datastore.getProperties();
    properties.forEach(property => server.create('property', { ...property }));
}

export function loadProducts(server: Server): void {
    const products = window.datastore.getProducts();
    products.forEach(product => {
        server.create('product', { id: product.id });
        product.property_values.forEach(propertyValue =>
            server.create('property-value', {
                productId: product.id,
                propertyId: propertyValue.property_id,
                value: propertyValue.value,
            }),
        );
    });
}

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'property-value': PropertyValueModel & { productId: number; propertyId: number };
    }
}
