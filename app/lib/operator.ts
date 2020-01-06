export enum Id {
    Eq = 'equals',
    Gt = 'greater_than',
    Lt = 'less_than',
    Any = 'any',
    None = 'none',
    In = 'in',
    Contains = 'contains',
}

export default interface Operator {
    id: Id;
    text?: string;
    needsInput: boolean;
    multi?: boolean;
    compare(value: string | number | undefined, filter: string): boolean;
}

export const operators: Operator[] = [
    {
        id: Id.Eq,
        needsInput: true,
        multi: false,
        compare(value, filter): boolean {
            if (typeof value === 'number') {
                return value === parseFloat(filter);
            }
            return value === filter;
        },
    },
    {
        id: Id.Gt,
        needsInput: true,
        multi: false,
        compare(value, filter): boolean {
            return typeof value === 'undefined' ? false : value > parseFloat(filter);
        },
    },
    {
        id: Id.Lt,
        needsInput: true,
        multi: false,
        compare(value, filter): boolean {
            return typeof value === 'undefined' ? false : value < parseFloat(filter);
        },
    },
    {
        id: Id.Any,
        needsInput: false,
        compare(value): boolean {
            return value !== null && typeof value !== 'undefined';
        },
    },
    {
        id: Id.None,
        needsInput: false,
        compare(value): boolean {
            return value === null || typeof value === 'undefined';
        },
    },
    {
        id: Id.In,
        needsInput: true,
        multi: true,
        compare(value, filter: string | string[]): boolean {
            const filterList = Array.isArray(filter) ? filter : filter.split(',');
            if (typeof value === 'undefined') {
                return false;
            }
            return typeof value === 'number'
                ? filterList.map(val => parseFloat(val)).includes(value)
                : filterList.map(val => val.trim()).includes(value.toString());
        },
    },
    {
        id: Id.Contains,
        needsInput: true,
        multi: false,
        compare(value, filter): boolean {
            return typeof value === 'undefined'
                ? false
                : value
                      .toString()
                      .toLowerCase()
                      .includes(filter.toLowerCase());
        },
    },
];

export function getOperator(id: Id): Operator {
    return operators.filter(operator => operator.id === id)[0];
}
