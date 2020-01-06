import { module, test } from 'qunit';
import validateNumberList from 'condition-editor/validators/number-list';

module('Unit | Validator | number-list');

const validValues = ['', '1', '1,2', '1, 2', ',1,2', '1,2,', ',1,2,', '1, 2, 3'];
const invalidValues = ['a', '1,a', 'a,1', '1,a,2', ',', ',,1', '1,,', ',,1,,', ',,1,2,,'];

test('it exists', function(assert) {
    const validate = validateNumberList();
    validValues.forEach(value =>
        assert.strictEqual(validate('foo', value, undefined, undefined, {}), true, `valid: "${value}"`),
    );
    invalidValues.forEach(value =>
        assert.equal(typeof validate('foo', value, undefined, undefined, {}), 'string', `invalid: "${value}"`),
    );
});
