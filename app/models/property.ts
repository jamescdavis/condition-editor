import Model, { attr } from '@ember-data/model';

export enum PropertyType {
    String = 'string',
    Number = 'number',
    Enumer = 'enumerated',
}

export default class PropertyModel extends Model {
    @attr('string') name!: string;

    @attr('string') type!: PropertyType;

    @attr() values?: string[];

    get isEnumerated(): boolean {
        return this.type === PropertyType.Enumer;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        property: PropertyModel;
    }
}
