import Ember from 'ember';

interface Product {
    id: number;
    property_values: PropertyValue[];
}

interface PropertyValue {
    property_id: number;
    value: string | number;
}

interface Property {
    id: number;
    name: string;
    type: PropertyType;
}

export enum PropertyType {
    String = 'string',
    Number = 'number',
    Enumerated = 'enumerated',
}

export interface Operator {
    text: string;
    id: string;
}

interface Datastore {
    getProducts(): Product[];
    getProperties(): Property[];
    getOperators(): Operator[];
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
    // interface Function extends Ember.FunctionPrototypeExtensions {}
    interface Window {
        datastore: Datastore;
    }
}
