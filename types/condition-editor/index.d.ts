import Ember from 'ember';
import { PropertyType } from 'condition-editor/models/property';
import { Id as OperatorId } from 'condition-editor/lib/operator';

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

export interface Operator {
    text: string;
    id: OperatorId;
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
