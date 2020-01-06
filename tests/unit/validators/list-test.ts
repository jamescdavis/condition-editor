import { module, test } from 'qunit';
import validateList from 'condition-editor/validators/list';

module('Unit | Validator | list');

const validValues = ['', 'a', 'a,b', 'a, b', ',a,b', 'a,b,', ',a,b,', 'a, b, c', '1', '1,a', 'a,1', '1,a,2'];
const invalidValues = [',', ',,a', 'a,,', ',,a,,', ',,a,b,,', 'a,,b', 'a, ,b'];

test('it exists', function(assert) {
    const validate = validateList();
    validValues.forEach(value =>
        assert.strictEqual(validate('foo', value, undefined, undefined, {}), true, `valid: "${value}"`),
    );
    invalidValues.forEach(value =>
        assert.equal(typeof validate('foo', value, undefined, undefined, {}), 'string', `invalid: "${value}"`),
    );
});
