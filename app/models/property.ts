import Model, { attr } from '@ember-data/model';
import { Id as Op } from 'condition-editor/lib/operator';

export enum PropertyType {
    String = 'string',
    Number = 'number',
    Enumer = 'enumerated',
}

type OperatorMap = {
    [propertyType in PropertyType]: Op[];
};

export const operatorMap: OperatorMap = {
    [PropertyType.String]: [Op.Eq, Op.Any, Op.None, Op.In, Op.Contains],
    [PropertyType.Number]: [Op.Eq, Op.Gt, Op.Lt, Op.Any, Op.None, Op.In],
    [PropertyType.Enumer]: [Op.Eq, Op.Any, Op.None, Op.In],
};

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
