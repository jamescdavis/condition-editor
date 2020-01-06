import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { getOperator, Id as Op } from 'condition-editor/lib/operator';

type Value = string | number | undefined;

type TestCase = [Value, string, boolean, string];

type TestMatrix = {
    [id in Op]: TestCase[];
};

const testMatrix: TestMatrix = {
    [Op.Eq]: [
        ['a', 'a', true, 'equivalent string'],
        ['b', 'a', false, 'inequivalent string'],
        [1, '1', true, 'equivalent integer'],
        [2, '1', false, 'inequivalent integer'],
        [1.2, '1.2', true, 'equivalent float'],
        [1.2, '1.200', true, 'equivalent float with trailing zeroes'],
        [2.1, '1.1', false, 'inequivalent float'],
        [1, '1.0', true, 'trailing zero float input  == integer value'],
        [1.0, '1', true, 'integer input == trailing zero float value'],
        ['', '', true, 'empty string'],
        [undefined, 'a', false, 'undefined'],
    ],
    [Op.Gt]: [
        [2, '1', true, 'greater integer'],
        [1, '1', false, 'equivalent integer'],
        [0, '1', false, 'lesser integer'],
        [1.3, '1.2', true, 'greater float'],
        [1.2, '1.2', false, 'equivalent float'],
        [1.1, '1.2', false, 'lesser float'],
        ['', '', false, 'empty string'],
        [undefined, '1', false, 'undefined'],
    ],
    [Op.Lt]: [
        [0, '1', true, 'lesser integer'],
        [1, '1', false, 'equivalent integer'],
        [2, '1', false, 'greater integer'],
        [1.1, '1.2', true, 'lesser float'],
        [1.2, '1.2', false, 'equivalent float'],
        [1.3, '1.2', false, 'greater float'],
        ['', '', false, 'empty string'],
        [undefined, '1', false, 'undefined'],
    ],
    [Op.Any]: [
        ['a', '', true, 'string value'],
        [1, '', true, 'number value'],
        [undefined, '', false, 'undefined value'],
    ],
    [Op.None]: [
        ['a', '', false, 'string value'],
        [1, '', false, 'number value'],
        [undefined, '', true, 'undefined value'],
    ],
    [Op.In]: [
        ['foo', 'foo', true, 'single value'],
        ['Foo', 'foo', false, 'case sensitive'],
        ['foo', 'foo,bar,baz', true, 'in comma-separated list (first)'],
        ['bar', 'foo,bar,baz', true, 'in comma-separated list (middle)'],
        ['baz', 'foo,bar,baz', true, 'in comma-separated list (last)'],
        ['bar', 'foo, bar, baz', true, 'spaces after commas'],
        ['bar', 'foo ,bar ,baz', true, 'spaces before commas'],
        ['bar', 'foo , bar , baz', true, 'spaces around commas'],
        ['foo bar', 'foo foo, foo bar, foo baz', true, 'multi-word in list'],
        ['foo boo', 'foo foo, foo bar, foo baz', false, 'multi-word not in list'],
        ['foo', 'foo foo, foo bar, foo baz', false, 'single-word not in list'],
        ['foo bar', 'foo,bar,baz', false, 'no partial match'],
        [2, '1,2,3', true, 'integer in list'],
        [4, '1,2,3', false, 'integer not in list'],
        [2.0, '1.0,2.0,3.0', true, 'float in list'],
        [4.1, '1.0,2.0,3.0', false, 'float not in list'],
        [2, '1.0,2.0,3.0', true, 'trailing zero float input == integer value'],
        [2.0, '1,2,3', true, 'integer input == trailing zero float value'],
    ],
    [Op.Contains]: [
        ['foo', 'foo', true, 'exact string'],
        ['FoO', 'foo', true, 'exact string (case insensitive)'],
        ['foobarbaz', 'bar', true, 'contained string'],
        ['fooBaRbaz', 'bar', true, 'contained string (case insensitive)'],
        [1, '1', true, 'exact integer'],
        [111, '1', true, 'contained integer'],
        [1.2, '1.2', true, 'exact float'],
        [12.3, '2', true, 'contained float'],
        ['foo', 'bar', false, 'no match (string)'],
        [1, '2', false, 'no match (integer)'],
        [1.1, '2.1', false, 'no match (float)'],
    ],
};

module('Unit | lib | operator', function(hooks) {
    setupTest(hooks);

    Object.entries(testMatrix).forEach(([id, cases]: [Op, TestCase[]]) =>
        test(id, function(assert: Assert) {
            cases.forEach(([a, b, expected, message]) =>
                assert.equal(getOperator(id).compare(a, b), expected, message),
            );
        }),
    );
});
