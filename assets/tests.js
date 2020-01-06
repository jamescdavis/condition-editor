'use strict';

define("condition-editor/tests/acceptance/application-test", ["qunit", "@ember/test-helpers", "ember-qunit", "ember-cli-mirage/test-support", "condition-editor/mirage/util", "condition-editor/tests/helpers/select", "condition-editor/lib/operator"], function (_qunit, _testHelpers, _emberQunit, _testSupport, _util, _select, _operator) {
  "use strict";

  async function input(value) {
    await (0, _testHelpers.fillIn)('[data-test-input]', value);
    await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
  }

  (0, _qunit.module)('Acceptance | application', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);
    (0, _testSupport.setupMirage)(hooks);
    hooks.beforeEach(async function () {
      (0, _util.loadProperties)(this.server);
      (0, _util.loadProducts)(this.server);
      this.store = this.owner.lookup('service:store');
      this.properties = await this.store.findAll('property');

      this.chooseProperty = async name => {
        const list = this.properties.toArray().filter(property => property.name === name);

        if (list.length > 0) {
          await (0, _select.selectProperty)(list[0]);
        }
      };
    });
    (0, _qunit.test)('visiting /', async function (assert) {
      await (0, _testHelpers.visit)('/');
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await this.chooseProperty('Product Name');
      await (0, _select.selectOperator)(_operator.Id.Eq);
      await input('Cell Phone');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row]').containsText('Cell Phone');
      await input('Key');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row]').containsText('Key');
      await (0, _select.selectOperator)(_operator.Id.Any);
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await (0, _select.selectOperator)(_operator.Id.None);
      assert.dom('[data-test-product-row]').doesNotExist();
      await (0, _select.selectOperator)(_operator.Id.In);
      await input('Key');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row]').containsText('Key');
      await input('Key, Cup');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      await input(', Key');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await input('Key,');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await input('Key,,Cup');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _select.selectOperator)(_operator.Id.Contains);
      await input('key');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-product-row]').containsText('Key');
      await (0, _testHelpers.click)('[data-test-clear-button]');
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await this.chooseProperty('weight (oz)');
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await input('3');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      await input('19');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row]').containsText('Hammer');
      await input('1.0');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row]').containsText('Key');
      await input('foo');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row]').containsText('Key');
      await (0, _select.selectOperator)(_operator.Id.Gt);
      await input('0');
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await input('1');
      assert.dom('[data-test-product-row]').exists({
        count: 5
      });
      await input('0.9');
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await (0, _select.selectOperator)(_operator.Id.Lt);
      await input('0');
      assert.dom('[data-test-product-row]').exists({
        count: 0
      });
      await input('5');
      assert.dom('[data-test-product-row]').exists({
        count: 3
      });
      await input('0.9');
      assert.dom('[data-test-product-row]').exists({
        count: 0
      });
      await input('10');
      assert.dom('[data-test-product-row]').exists({
        count: 5
      });
      await (0, _select.selectOperator)(_operator.Id.Any);
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await (0, _select.selectOperator)(_operator.Id.None);
      assert.dom('[data-test-product-row]').exists({
        count: 0
      });
      await (0, _select.selectOperator)(_operator.Id.In);
      await input('19');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row]').containsText('Hammer');
      await input('1, 19');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      await input('1, a, 5');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await input('1, ,5');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await input(',1,5');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await input('1,5,');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await this.chooseProperty('wireless');
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom('[data-test-product-row]').exists({
        count: 6
      });
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-single-select-input="true"]');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-single-select-input="false"]');
      assert.dom('[data-test-product-row]').exists({
        count: 2
      });
      await (0, _select.selectOperator)(_operator.Id.Any);
      assert.dom('[data-test-product-row]').exists({
        count: 3
      });
      await (0, _select.selectOperator)(_operator.Id.None);
      assert.dom('[data-test-product-row]').exists({
        count: 3
      });
      await (0, _select.selectOperator)(_operator.Id.In);
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-multi-select-input="true"]');
      assert.dom('[data-test-product-row]').exists({
        count: 1
      });
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-multi-select-input="false"]');
      assert.dom('[data-test-product-row]').exists({
        count: 3
      });
    });
  });
});
define("condition-editor/tests/helpers/ember-power-select", ["exports", "ember-power-select/test-support/helpers"], function (_exports, _helpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = deprecatedRegisterHelpers;
  _exports.selectChoose = _exports.touchTrigger = _exports.nativeTouch = _exports.clickTrigger = _exports.typeInSearch = _exports.triggerKeydown = _exports.nativeMouseUp = _exports.nativeMouseDown = _exports.findContains = void 0;

  function deprecateHelper(fn, name) {
    return function (...args) {
      (true && !(false) && Ember.deprecate(`DEPRECATED \`import { ${name} } from '../../tests/helpers/ember-power-select';\` is deprecated. Please, replace it with \`import { ${name} } from 'ember-power-select/test-support/helpers';\``, false, {
        until: '1.11.0',
        id: `ember-power-select-test-support-${name}`
      }));
      return fn(...args);
    };
  }

  let findContains = deprecateHelper(_helpers.findContains, 'findContains');
  _exports.findContains = findContains;
  let nativeMouseDown = deprecateHelper(_helpers.nativeMouseDown, 'nativeMouseDown');
  _exports.nativeMouseDown = nativeMouseDown;
  let nativeMouseUp = deprecateHelper(_helpers.nativeMouseUp, 'nativeMouseUp');
  _exports.nativeMouseUp = nativeMouseUp;
  let triggerKeydown = deprecateHelper(_helpers.triggerKeydown, 'triggerKeydown');
  _exports.triggerKeydown = triggerKeydown;
  let typeInSearch = deprecateHelper(_helpers.typeInSearch, 'typeInSearch');
  _exports.typeInSearch = typeInSearch;
  let clickTrigger = deprecateHelper(_helpers.clickTrigger, 'clickTrigger');
  _exports.clickTrigger = clickTrigger;
  let nativeTouch = deprecateHelper(_helpers.nativeTouch, 'nativeTouch');
  _exports.nativeTouch = nativeTouch;
  let touchTrigger = deprecateHelper(_helpers.touchTrigger, 'touchTrigger');
  _exports.touchTrigger = touchTrigger;
  let selectChoose = deprecateHelper(_helpers.selectChoose, 'selectChoose');
  _exports.selectChoose = selectChoose;

  function deprecatedRegisterHelpers() {
    (true && !(false) && Ember.deprecate("DEPRECATED `import registerPowerSelectHelpers from '../../tests/helpers/ember-power-select';` is deprecated. Please, replace it with `import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';`", false, {
      until: '1.11.0',
      id: 'ember-power-select-test-support-register-helpers'
    }));
    return (0, _helpers.default)();
  }
});
define("condition-editor/tests/helpers/input-type", ["exports", "condition-editor/lib/operator", "condition-editor/models/property"], function (_exports, _operator, _property) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.assertsForInputType = assertsForInputType;
  _exports.expectedInputTypes = _exports.InputType = void 0;
  let InputType;
  _exports.InputType = InputType;

  (function (InputType) {
    InputType[InputType["None"] = 0] = "None";
    InputType[InputType["Text"] = 1] = "Text";
    InputType[InputType["SingleSelect"] = 2] = "SingleSelect";
    InputType[InputType["MultiSelect"] = 3] = "MultiSelect";
  })(InputType || (_exports.InputType = InputType = {}));

  const expectedInputTypes = {
    [_property.PropertyType.String]: {
      [_operator.Id.Eq]: InputType.Text,
      [_operator.Id.Any]: InputType.None,
      [_operator.Id.None]: InputType.None,
      [_operator.Id.In]: InputType.Text,
      [_operator.Id.Contains]: InputType.Text
    },
    [_property.PropertyType.Number]: {
      [_operator.Id.Eq]: InputType.Text,
      [_operator.Id.Gt]: InputType.Text,
      [_operator.Id.Lt]: InputType.Text,
      [_operator.Id.Any]: InputType.None,
      [_operator.Id.None]: InputType.None,
      [_operator.Id.In]: InputType.Text
    },
    [_property.PropertyType.Enumer]: {
      [_operator.Id.Eq]: InputType.SingleSelect,
      [_operator.Id.Any]: InputType.None,
      [_operator.Id.None]: InputType.None,
      [_operator.Id.In]: InputType.MultiSelect
    }
  };
  _exports.expectedInputTypes = expectedInputTypes;

  function assertsForInputType(assert, inputType) {
    switch (inputType) {
      case InputType.None:
        assert.dom('[data-test-input-box] [data-test-input]').doesNotExist();
        assert.dom('[data-test-input-box] .ember-power-select-trigger').doesNotExist();
        assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').doesNotExist();
        break;

      case InputType.Text:
        assert.dom('[data-test-input-box] [data-test-input]').exists({
          count: 1
        });
        assert.dom('[data-test-input-box] .ember-power-select-trigger').doesNotExist();
        assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').doesNotExist();
        break;

      case InputType.SingleSelect:
        assert.dom('[data-test-input-box] [data-test-input]').doesNotExist();
        assert.dom('[data-test-input-box] .ember-power-select-trigger').exists({
          count: 1
        });
        assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').doesNotExist();
        break;

      case InputType.MultiSelect:
        assert.dom('[data-test-input-box] [data-test-input]').doesNotExist();
        assert.dom('[data-test-input-box] .ember-power-select-trigger').exists({
          count: 1
        });
        assert.dom('[data-test-input-box] .ember-power-select-multiple-trigger').exists({
          count: 1
        });
        break;

      default:
    }
  }
});
define("condition-editor/tests/helpers/select", ["exports", "@ember/test-helpers"], function (_exports, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.selectProperty = selectProperty;
  _exports.selectOperator = selectOperator;

  async function selectProperty(property) {
    await (0, _testHelpers.click)('[data-test-property-chooser-box] .ember-power-select-trigger');
    await (0, _testHelpers.click)(`[data-test-property-chooser="${property.id}"]`);
  }

  async function selectOperator(operator) {
    await (0, _testHelpers.click)('[data-test-operator-chooser-box] .ember-power-select-trigger');
    await (0, _testHelpers.click)(`[data-test-operator-chooser="${operator}"]`);
  }
});
define("condition-editor/tests/in-run-loop.d", [], function () {
  "use strict";
});
define("condition-editor/tests/integration/components/condition-editor-test", ["qunit", "ember-qunit", "@ember/test-helpers", "ember-cli-mirage/test-support", "condition-editor/lib/operator", "condition-editor/models/property", "condition-editor/tests/helpers/input-type", "condition-editor/tests/helpers/select"], function (_qunit, _emberQunit, _testHelpers, _testSupport, _operator, _property, _inputType, _select) {
  "use strict";

  (0, _qunit.module)('Integration | Component | condition-editor', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _testSupport.setupMirage)(hooks);
    hooks.beforeEach(async function (assert) {
      this.store = this.owner.lookup('service:store');
      this.properties = [this.store.createRecord('property', {
        id: 0,
        name: 'Foo',
        type: _property.PropertyType.String
      }), this.store.createRecord('property', {
        id: 1,
        name: 'Bar',
        type: _property.PropertyType.Number
      }), this.store.createRecord('property', {
        id: 2,
        name: 'Baz',
        type: _property.PropertyType.Enumer,
        values: ['foo', 'bar', 'baz']
      })];
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        
                  <ConditionEditor @properties={{this.properties}} as |ce|>
                      <span data-test-selected-property={{ce.property.id}}>{{ce.property.name}}</span>
                      <span data-test-selected-operator={{ce.operator.id}}>{{ce.operator.text}}</span>
                      <span data-test-input-value>{{ce.input}}</span>
                  </ConditionEditor>
              
      */
      {
        id: "orJDc3gH",
        block: "{\"symbols\":[\"ce\"],\"statements\":[[0,\"\\n            \"],[5,\"condition-editor\",[],[[\"@properties\"],[[23,0,[\"properties\"]]]],{\"statements\":[[0,\"\\n                \"],[7,\"span\",true],[11,\"data-test-selected-property\",[23,1,[\"property\",\"id\"]]],[8],[1,[23,1,[\"property\",\"name\"]],false],[9],[0,\"\\n                \"],[7,\"span\",true],[11,\"data-test-selected-operator\",[23,1,[\"operator\",\"id\"]]],[8],[1,[23,1,[\"operator\",\"text\"]],false],[9],[0,\"\\n                \"],[7,\"span\",true],[10,\"data-test-input-value\",\"\"],[8],[1,[23,1,[\"input\"]],false],[9],[0,\"\\n            \"]],\"parameters\":[1]}],[0,\"\\n        \"]],\"hasEval\":false}",
        meta: {}
      }));
      assert.dom('[data-test-condition-editor]').exists({
        count: 1
      });
      assert.dom('[data-test-operator-chooser-box] .ember-power-select-trigger').doesNotExist();
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.None);
    });
    (0, _qunit.test)('correct input type for prop and operator', async function (assert) {
      for (let p = 0; p < this.properties.length; p++) {
        await (0, _select.selectProperty)(this.properties[p]);
        assert.dom(`[data-test-selected-property="${this.properties[p].id}"]`).exists({
          count: 1
        });
        assert.dom('[data-test-operator-chooser-box] .ember-power-select-trigger').exists({
          count: 1
        });
        (0, _inputType.assertsForInputType)(assert, _inputType.InputType.None);
        const operators = _property.operatorMap[this.properties[p].type];

        for (let o = 0; o < operators.length; o++) {
          await (0, _select.selectOperator)(operators[o]);
          assert.dom(`[data-test-selected-operator="${operators[o]}"]`).exists({
            count: 1
          });
          (0, _inputType.assertsForInputType)(assert, _inputType.expectedInputTypes[this.properties[p].type][operators[o]]);
        }
      }
    });
    (0, _qunit.test)('values yielded correctly', async function (assert) {
      await (0, _select.selectProperty)(this.properties[0]);
      assert.dom('[data-test-selected-property="0"]').exists({
        count: 1
      });
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Eq}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo');
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _select.selectProperty)(this.properties[2]);
      assert.dom('[data-test-selected-property="2"]').exists({
        count: 1
      });
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Eq}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.SingleSelect);
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-single-select-input="bar"]');
      assert.dom('[data-test-input-value]').hasText('bar');
      await (0, _select.selectOperator)(_operator.Id.In);
      assert.dom(`[data-test-selected-operator="${_operator.Id.In}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.MultiSelect);
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-multi-select-input="foo"]');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-multi-select-input="bar"]');
      assert.dom('[data-test-input-value]').hasText('foo,bar');
      await (0, _testHelpers.click)('[data-test-input-box] .ember-power-select-trigger');
      await (0, _testHelpers.click)('[data-test-multi-select-input="baz"]');
      assert.dom('[data-test-input-value]').hasText('foo,bar,baz');
    });
    (0, _qunit.test)('clear button clears', async function (assert) {
      await (0, _select.selectProperty)(this.properties[0]);
      assert.dom('[data-test-selected-property="0"]').exists({
        count: 1
      });
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Eq}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo');
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _testHelpers.click)('[data-test-clear-button]');
      assert.dom('[data-test-operator-chooser-box] .ember-power-select-trigger').doesNotExist();
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.None);
      assert.dom('[data-test-selected-property]').doesNotExist();
      assert.dom('[data-test-selected-operator]').doesNotExist();
      assert.dom('[data-test-input-value]').hasNoText();
    });
    (0, _qunit.test)('changing operators clears input', async function (assert) {
      await (0, _select.selectProperty)(this.properties[0]);
      assert.dom('[data-test-selected-property="0"]').exists({
        count: 1
      });
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Eq}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo');
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _select.selectOperator)(_operator.Id.Contains);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Contains}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      assert.dom('[data-test-input-value]').hasNoText();
    });
    (0, _qunit.test)('changing properties resets operator and clears input', async function (assert) {
      await (0, _select.selectProperty)(this.properties[0]);
      assert.dom('[data-test-selected-property="0"]').exists({
        count: 1
      });
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Eq}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo');
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _select.selectProperty)(this.properties[1]);
      assert.dom('[data-test-input-value]').hasNoText();
      assert.dom('[data-test-selected-operator]').doesNotExist();
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.None);
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Eq}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      assert.dom('[data-test-input-value]').hasNoText();
    });
    (0, _qunit.test)('string validations', async function (assert) {
      await (0, _select.selectProperty)(this.properties[0]);
      assert.dom('[data-test-selected-property="0"]').exists({
        count: 1
      });
      await (0, _select.selectOperator)(_operator.Id.In);
      assert.dom(`[data-test-selected-operator="${_operator.Id.In}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo');
      assert.dom('[data-test-validation-messages]').hasNoText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo,,bar');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo, ,bar');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _testHelpers.fillIn)('[data-test-input]', ',foo,bar');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo,bar,');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo');
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo,bar');
      assert.dom('[data-test-validation-messages]').hasNoText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo,bar');
      await (0, _testHelpers.fillIn)('[data-test-input]', 'foo, bar');
      assert.dom('[data-test-validation-messages]').hasNoText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('foo, bar');
    });
    (0, _qunit.test)('number validations', async function (assert) {
      await (0, _select.selectProperty)(this.properties[1]);
      assert.dom('[data-test-selected-property="1"]').exists({
        count: 1
      });
      await (0, _select.selectOperator)(_operator.Id.Eq);
      assert.dom(`[data-test-selected-operator="${_operator.Id.Eq}"]`).exists({
        count: 1
      });
      (0, _inputType.assertsForInputType)(assert, _inputType.InputType.Text);
      await (0, _testHelpers.fillIn)('[data-test-input]', '1');
      assert.dom('[data-test-validation-messages]').hasNoText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1');
      await (0, _testHelpers.fillIn)('[data-test-input]', 'a');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1');
      await (0, _testHelpers.fillIn)('[data-test-input]', '2');
      assert.dom('[data-test-validation-messages]').hasNoText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('2');
      await (0, _select.selectOperator)(_operator.Id.In);
      await (0, _testHelpers.fillIn)('[data-test-input]', '1,2,3');
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1,2,3');
      assert.dom('[data-test-validation-messages]').hasNoText();
      await (0, _testHelpers.fillIn)('[data-test-input]', '1,b,3');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1,2,3');
      await (0, _testHelpers.fillIn)('[data-test-input]', '1, ,3');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1,2,3');
      await (0, _testHelpers.fillIn)('[data-test-input]', '1,,3');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1,2,3');
      await (0, _testHelpers.fillIn)('[data-test-input]', ',1,3');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1,2,3');
      await (0, _testHelpers.fillIn)('[data-test-input]', '1,3,');
      assert.dom('[data-test-validation-messages]').hasAnyText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1,2,3');
      await (0, _testHelpers.fillIn)('[data-test-input]', '1,3');
      assert.dom('[data-test-validation-messages]').hasNoText();
      await (0, _testHelpers.triggerKeyEvent)('[data-test-input]', 'keydown', 'ENTER');
      assert.dom('[data-test-input-value]').hasText('1,3');
    });
  });
});
define("condition-editor/tests/integration/components/operator-chooser-test", ["qunit", "ember-qunit", "@ember/test-helpers", "condition-editor/lib/operator", "condition-editor/models/property"], function (_qunit, _emberQunit, _testHelpers, _operator, _property) {
  "use strict";

  (0, _qunit.module)('Integration | Component | operator-chooser', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(function () {
      this.store = this.owner.lookup('service:store');

      this.onChange = operator => {
        this.set('selectedOperator', operator);
      };
    });
    (0, _qunit.test)('chooses operators for string properties', async function (assert) {
      this.set('property', this.store.createRecord('property', {
        type: _property.PropertyType.String
      }));
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <OperatorChooser
                  @property={{this.property}}
                  @operator={{this.selectedOperator}}
                  @onChange={{this.onChange}}
              />
      */
      {
        id: "1fJuSgEZ",
        block: "{\"symbols\":[],\"statements\":[[5,\"operator-chooser\",[],[[\"@property\",\"@operator\",\"@onChange\"],[[23,0,[\"property\"]],[23,0,[\"selectedOperator\"]],[23,0,[\"onChange\"]]]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.strictEqual(this.selectedOperator, undefined, 'initial');
      const operators = _property.operatorMap[_property.PropertyType.String];

      for (let i = 0; i < operators.length; i++) {
        var _this$selectedOperato;

        await (0, _testHelpers.click)('.ember-power-select-trigger');
        await (0, _testHelpers.click)(`[data-test-operator-chooser="${operators[i]}"]`);
        assert.strictEqual((_this$selectedOperato = this.selectedOperator) === null || _this$selectedOperato === void 0 ? void 0 : _this$selectedOperato.id, operators[i], `choose: ${(0, _operator.getOperator)(operators[i]).text}`);
      }

      await (0, _testHelpers.click)('.ember-power-select-trigger');
      assert.dom(`[data-test-operator-chooser="${_operator.Id.Gt}"]`).doesNotExist(`not available: ${(0, _operator.getOperator)(_operator.Id.Gt).text}`);
      assert.dom(`[data-test-operator-chooser="${_operator.Id.Lt}"]`).doesNotExist(`not available: ${(0, _operator.getOperator)(_operator.Id.Lt).text}`);
    });
    (0, _qunit.test)('chooses operators for number properties', async function (assert) {
      this.set('property', this.store.createRecord('property', {
        type: _property.PropertyType.Number
      }));
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <OperatorChooser
                  @property={{this.property}}
                  @operator={{this.selectedOperator}}
                  @onChange={{this.onChange}}
              />
      */
      {
        id: "1fJuSgEZ",
        block: "{\"symbols\":[],\"statements\":[[5,\"operator-chooser\",[],[[\"@property\",\"@operator\",\"@onChange\"],[[23,0,[\"property\"]],[23,0,[\"selectedOperator\"]],[23,0,[\"onChange\"]]]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.strictEqual(this.selectedOperator, undefined, 'initial');
      const operators = _property.operatorMap[_property.PropertyType.Number];

      for (let i = 0; i < operators.length; i++) {
        var _this$selectedOperato2;

        await (0, _testHelpers.click)('.ember-power-select-trigger');
        await (0, _testHelpers.click)(`[data-test-operator-chooser="${operators[i]}"]`);
        assert.strictEqual((_this$selectedOperato2 = this.selectedOperator) === null || _this$selectedOperato2 === void 0 ? void 0 : _this$selectedOperato2.id, operators[i], `choose: ${(0, _operator.getOperator)(operators[i]).text}`);
      }

      await (0, _testHelpers.click)('.ember-power-select-trigger');
      assert.dom(`[data-test-operator-chooser="${_operator.Id.Contains}"]`).doesNotExist(`not available: ${(0, _operator.getOperator)(_operator.Id.Contains).text}`);
    });
    (0, _qunit.test)('chooses operators for enumerated properties', async function (assert) {
      this.set('property', this.store.createRecord('property', {
        type: _property.PropertyType.Enumer
      }));
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <OperatorChooser
                  @property={{this.property}}
                  @operator={{this.selectedOperator}}
                  @onChange={{this.onChange}}
              />
      */
      {
        id: "1fJuSgEZ",
        block: "{\"symbols\":[],\"statements\":[[5,\"operator-chooser\",[],[[\"@property\",\"@operator\",\"@onChange\"],[[23,0,[\"property\"]],[23,0,[\"selectedOperator\"]],[23,0,[\"onChange\"]]]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.strictEqual(this.selectedOperator, undefined, 'initial');
      const operators = _property.operatorMap[_property.PropertyType.Enumer];

      for (let i = 0; i < operators.length; i++) {
        var _this$selectedOperato3;

        await (0, _testHelpers.click)('.ember-power-select-trigger');
        await (0, _testHelpers.click)(`[data-test-operator-chooser="${operators[i]}"]`);
        assert.strictEqual((_this$selectedOperato3 = this.selectedOperator) === null || _this$selectedOperato3 === void 0 ? void 0 : _this$selectedOperato3.id, operators[i], `choose: ${(0, _operator.getOperator)(operators[i]).text}`);
      }

      await (0, _testHelpers.click)('.ember-power-select-trigger');
      assert.dom(`[data-test-operator-chooser="${_operator.Id.Gt}"]`).doesNotExist(`not available: ${(0, _operator.getOperator)(_operator.Id.Gt).text}`);
      assert.dom(`[data-test-operator-chooser="${_operator.Id.Lt}"]`).doesNotExist(`not available: ${(0, _operator.getOperator)(_operator.Id.Lt).text}`);
      assert.dom(`[data-test-operator-chooser="${_operator.Id.Contains}"]`).doesNotExist(`not available: ${(0, _operator.getOperator)(_operator.Id.Contains).text}`);
    });
  });
});
define("condition-editor/tests/integration/components/product-table-test", ["qunit", "ember-qunit", "@ember/test-helpers", "ember-cli-mirage/test-support", "condition-editor/lib/operator"], function (_qunit, _emberQunit, _testHelpers, _testSupport, _operator) {
  "use strict";

  (0, _qunit.module)('Integration | Component | product-table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _testSupport.setupMirage)(hooks);
    hooks.beforeEach(async function () {
      this.store = this.owner.lookup('service:store');
      this.server.create('property', {
        id: 0,
        name: 'Foo'
      });
      this.server.create('property', {
        id: 1,
        name: 'Bar'
      });
      this.server.create('property', {
        id: 2,
        name: 'Baz'
      });
      this.properties = await this.store.findAll('property');
      this.server.create('product', {
        id: 0
      });
      this.server.create('product', {
        id: 1
      });
      this.server.create('product', {
        id: 2
      });
      this.products = await this.store.findAll('product');
      this.properties.forEach(property => this.products.forEach(product => this.server.create('property-value', {
        productId: parseInt(product.id, 0),
        propertyId: parseInt(property.id, 0),
        value: `${property.name.toLowerCase()}-${product.id}`
      })));
    });
    (0, _qunit.test)('displays products', async function (assert) {
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <ProductTable @properties={{this.properties}} />
      */
      {
        id: "U/lNoBLm",
        block: "{\"symbols\":[],\"statements\":[[5,\"product-table\",[],[[\"@properties\"],[[23,0,[\"properties\"]]]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.dom('[data-test-product-table]').exists({
        count: 1
      });
      this.products.forEach(product => assert.dom(`[data-test-product-row="${product.id}"]`).exists({
        count: 1
      }));
      this.products.forEach(product => this.properties.forEach(property => {
        assert.dom(`[data-test-property-header="${property.id}"]`).exists({
          count: 1
        });
        assert.dom(`[data-test-property-header="${property.id}"]`).hasText(property.name);
        assert.dom(`[data-test-product-row="${product.id}"] [data-test-property-value="${property.id}"]`).exists({
          count: 1
        });
        assert.dom(`[data-test-product-row="${product.id}"] [data-test-property-value="${property.id}"]`).hasText(product.propValsByPropId[property.id].toString());
      }));
    });
    (0, _qunit.test)('filters products', async function (assert) {
      const operator = (0, _operator.getOperator)(_operator.Id.Eq);
      const property = this.properties.toArray()[1];
      this.setProperties({
        property,
        operator
      });
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <ProductTable
                  @properties={{this.properties}}
                  @property={{this.property}}
                  @operator={{this.operator}}
                  @filter='bar-1'
              />
      */
      {
        id: "YloFH+x1",
        block: "{\"symbols\":[],\"statements\":[[5,\"product-table\",[],[[\"@properties\",\"@property\",\"@operator\",\"@filter\"],[[23,0,[\"properties\"]],[23,0,[\"property\"]],[23,0,[\"operator\"]],\"bar-1\"]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.dom('[data-test-product-row="0"]').doesNotExist();
      assert.dom('[data-test-product-row="1"]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row="2"]').doesNotExist();
    });
    (0, _qunit.test)('updates product list on filter change', async function (assert) {
      const operator = (0, _operator.getOperator)(_operator.Id.Eq);
      const property = this.properties.toArray()[1];
      this.setProperties({
        property,
        operator,
        filter: 'bar-1'
      });
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <ProductTable
                  @properties={{this.properties}}
                  @property={{this.property}}
                  @operator={{this.operator}}
                  @filter='{{this.filter}}'
              />
      */
      {
        id: "kP5yoxvc",
        block: "{\"symbols\":[],\"statements\":[[5,\"product-table\",[],[[\"@properties\",\"@property\",\"@operator\",\"@filter\"],[[23,0,[\"properties\"]],[23,0,[\"property\"]],[23,0,[\"operator\"]],[29,[[23,0,[\"filter\"]]]]]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.dom('[data-test-product-row="0"]').doesNotExist();
      assert.dom('[data-test-product-row="1"]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row="2"]').doesNotExist();
      this.setProperties({
        filter: 'bar-2'
      });
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-product-row="0"]').doesNotExist();
      assert.dom('[data-test-product-row="1"]').doesNotExist();
      assert.dom('[data-test-product-row="2"]').exists({
        count: 1
      });
    });
    (0, _qunit.test)('updates product list on operator change', async function (assert) {
      const operator = (0, _operator.getOperator)(_operator.Id.Eq);
      const property = this.properties.toArray()[1];
      this.setProperties({
        property,
        operator
      });
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <ProductTable
                  @properties={{this.properties}}
                  @property={{this.property}}
                  @operator={{this.operator}}
                  @filter='bar-1'
              />
      */
      {
        id: "YloFH+x1",
        block: "{\"symbols\":[],\"statements\":[[5,\"product-table\",[],[[\"@properties\",\"@property\",\"@operator\",\"@filter\"],[[23,0,[\"properties\"]],[23,0,[\"property\"]],[23,0,[\"operator\"]],\"bar-1\"]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.dom('[data-test-product-row="0"]').doesNotExist();
      assert.dom('[data-test-product-row="1"]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row="2"]').doesNotExist();
      this.setProperties({
        operator: _operator.Id.Any
      });
      await (0, _testHelpers.settled)();
      assert.dom('[data-test-product-row="0"]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row="1"]').exists({
        count: 1
      });
      assert.dom('[data-test-product-row="2"]').exists({
        count: 1
      });
    });
  });
});
define("condition-editor/tests/integration/components/property-chooser-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Component | property-chooser', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('chooses properties', async function (assert) {
      const properties = [{
        id: '0',
        name: 'Foo'
      }, {
        id: '1',
        name: 'Bar'
      }, {
        id: '2',
        name: 'Baz'
      }];

      const onChange = property => {
        this.selectedProperty = property;
      };

      this.setProperties({
        properties,
        onChange
      });
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        <PropertyChooser
                  @properties={{this.properties}}
                  @selected={{this.selectedProperty}}
                  @onChange={{this.onChange}}
              />
      */
      {
        id: "FQSAYLWY",
        block: "{\"symbols\":[],\"statements\":[[5,\"property-chooser\",[],[[\"@properties\",\"@selected\",\"@onChange\"],[[23,0,[\"properties\"]],[23,0,[\"selectedProperty\"]],[23,0,[\"onChange\"]]]]]],\"hasEval\":false}",
        meta: {}
      }));
      assert.strictEqual(this.selectedProperty, undefined, 'initial');

      for (let i = 0; i < properties.length; i++) {
        await (0, _testHelpers.click)('.ember-power-select-trigger');
        await (0, _testHelpers.click)(`[data-test-property-chooser="${i}"]`);
        assert.strictEqual(this.selectedProperty, properties[i], properties[i].name);
      }
    });
  });
});
define("condition-editor/tests/test-helper", ["@ember/test-helpers", "ember-qunit", "condition-editor/app", "condition-editor/config/environment", "qunit-dom"], function (_testHelpers, _emberQunit, _app, _environment, _qunitDom) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("condition-editor/tests/unit/controllers/application-test", ["qunit", "ember-qunit", "ember-cli-mirage/test-support", "condition-editor/mirage/util"], function (_qunit, _emberQunit, _testSupport, _util) {
  "use strict";

  (0, _qunit.module)('Unit | Controller | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _testSupport.setupMirage)(hooks);
    (0, _qunit.test)('load properties', async function (assert) {
      var _controller$propertie;

      (0, _util.loadProperties)(this.server);
      const controller = this.owner.lookup('controller:application');
      await controller.loadProperties.perform();
      assert.equal((_controller$propertie = controller.properties) === null || _controller$propertie === void 0 ? void 0 : _controller$propertie.length, 5, 'five properties loaded');
    });
  });
});
define("condition-editor/tests/unit/instance-initializers/load-operator-names-test", ["condition-editor/instance-initializers/load-operator-names", "qunit", "condition-editor/lib/operator"], function (_loadOperatorNames, _qunit, _operator) {
  "use strict";

  (0, _qunit.module)('Unit | Instance Initializer | load-operator-names', function (hooks) {
    hooks.beforeEach(function () {
      this.TestApplication = Ember.Application.extend();
      this.TestApplication.instanceInitializer({
        name: 'initializer under test',
        initialize: _loadOperatorNames.initialize
      });
      this.application = this.TestApplication.create({
        autoboot: false
      });
      this.instance = this.application.buildInstance();
    });
    hooks.afterEach(function () {
      Ember.run(this.instance, 'destroy');
      Ember.run(this.application, 'destroy');
    });
    (0, _qunit.test)('names loaded from datastore', async function (assert) {
      await this.instance.boot();
      window.datastore.getOperators().forEach(operator => assert.equal((0, _operator.getOperator)(operator.id).text, operator.text, `${operator.id} -> "${operator.text}"`));
    });
  });
});
define("condition-editor/tests/unit/lib/operator-test", ["qunit", "ember-qunit", "condition-editor/lib/operator"], function (_qunit, _emberQunit, _operator) {
  "use strict";

  const testMatrix = {
    [_operator.Id.Eq]: [['a', 'a', true, 'equivalent string'], ['b', 'a', false, 'inequivalent string'], [1, '1', true, 'equivalent integer'], [2, '1', false, 'inequivalent integer'], [1.2, '1.2', true, 'equivalent float'], [1.2, '1.200', true, 'equivalent float with trailing zeroes'], [2.1, '1.1', false, 'inequivalent float'], [1, '1.0', true, 'trailing zero float input  == integer value'], [1.0, '1', true, 'integer input == trailing zero float value'], ['', '', true, 'empty string'], [undefined, 'a', false, 'undefined']],
    [_operator.Id.Gt]: [[2, '1', true, 'greater integer'], [1, '1', false, 'equivalent integer'], [0, '1', false, 'lesser integer'], [1.3, '1.2', true, 'greater float'], [1.2, '1.2', false, 'equivalent float'], [1.1, '1.2', false, 'lesser float'], ['', '', false, 'empty string'], [undefined, '1', false, 'undefined']],
    [_operator.Id.Lt]: [[0, '1', true, 'lesser integer'], [1, '1', false, 'equivalent integer'], [2, '1', false, 'greater integer'], [1.1, '1.2', true, 'lesser float'], [1.2, '1.2', false, 'equivalent float'], [1.3, '1.2', false, 'greater float'], ['', '', false, 'empty string'], [undefined, '1', false, 'undefined']],
    [_operator.Id.Any]: [['a', '', true, 'string value'], [1, '', true, 'number value'], [undefined, '', false, 'undefined value']],
    [_operator.Id.None]: [['a', '', false, 'string value'], [1, '', false, 'number value'], [undefined, '', true, 'undefined value']],
    [_operator.Id.In]: [['foo', 'foo', true, 'single value'], ['Foo', 'foo', false, 'case sensitive'], ['foo', 'foo,bar,baz', true, 'in comma-separated list (first)'], ['bar', 'foo,bar,baz', true, 'in comma-separated list (middle)'], ['baz', 'foo,bar,baz', true, 'in comma-separated list (last)'], ['bar', 'foo, bar, baz', true, 'spaces after commas'], ['bar', 'foo ,bar ,baz', true, 'spaces before commas'], ['bar', 'foo , bar , baz', true, 'spaces around commas'], ['foo bar', 'foo foo, foo bar, foo baz', true, 'multi-word in list'], ['foo boo', 'foo foo, foo bar, foo baz', false, 'multi-word not in list'], ['foo', 'foo foo, foo bar, foo baz', false, 'single-word not in list'], ['foo bar', 'foo,bar,baz', false, 'no partial match'], [2, '1,2,3', true, 'integer in list'], [4, '1,2,3', false, 'integer not in list'], [2.0, '1.0,2.0,3.0', true, 'float in list'], [4.1, '1.0,2.0,3.0', false, 'float not in list'], [2, '1.0,2.0,3.0', true, 'trailing zero float input == integer value'], [2.0, '1,2,3', true, 'integer input == trailing zero float value']],
    [_operator.Id.Contains]: [['foo', 'foo', true, 'exact string'], ['FoO', 'foo', true, 'exact string (case insensitive)'], ['foobarbaz', 'bar', true, 'contained string'], ['fooBaRbaz', 'bar', true, 'contained string (case insensitive)'], [1, '1', true, 'exact integer'], [111, '1', true, 'contained integer'], [1.2, '1.2', true, 'exact float'], [12.3, '2', true, 'contained float'], ['foo', 'bar', false, 'no match (string)'], [1, '2', false, 'no match (integer)'], [1.1, '2.1', false, 'no match (float)']]
  };
  (0, _qunit.module)('Unit | lib | operator', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    Object.entries(testMatrix).forEach(([id, cases]) => (0, _qunit.test)(id, function (assert) {
      cases.forEach(([a, b, expected, message]) => assert.equal((0, _operator.getOperator)(id).compare(a, b), expected, message));
    }));
  });
});
define("condition-editor/tests/unit/models/product-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Model | product', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('remap property values by id', function (assert) {
      const store = this.owner.lookup('service:store');
      const product = store.createRecord('product', {});
      const properties = [store.createRecord('property', {
        id: 0
      }), store.createRecord('property', {
        id: 1
      }), store.createRecord('property', {
        id: 2
      })];
      const propertyValues = [store.createRecord('property-value', {
        product,
        property: properties[2],
        value: 'foo'
      }), store.createRecord('property-value', {
        product,
        property: properties[0],
        value: 'bar'
      }), store.createRecord('property-value', {
        product,
        property: properties[1],
        value: 'baz'
      })];
      propertyValues.forEach(propertyValue => {
        if (propertyValue.property) {
          const {
            property: {
              id
            },
            value
          } = propertyValue;
          assert.equal(product.propValsByPropId[id], value, `property ${id} remapped correctly`);
        }
      });
    });
  });
});
define("condition-editor/tests/unit/models/property-test", ["qunit", "ember-qunit", "condition-editor/models/property"], function (_qunit, _emberQunit, _property) {
  "use strict";

  (0, _qunit.module)('Unit | Model | property', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('string property', function (assert) {
      const name = 'String Property';
      const type = _property.PropertyType.String;
      const store = this.owner.lookup('service:store');
      const property = store.createRecord('property', {
        name,
        type
      });
      assert.equal(property.name, name, `property name is ${name}`);
      assert.equal(property.type, type, `property is of type: ${type}`);
      assert.notOk(property.isEnumerated, 'property is *not* enumerated');
    });
    (0, _qunit.test)('number property', function (assert) {
      const name = 'Number Property';
      const type = _property.PropertyType.Number;
      const store = this.owner.lookup('service:store');
      const property = store.createRecord('property', {
        name,
        type
      });
      assert.equal(property.name, name, `property name is ${name}`);
      assert.equal(property.type, type, `property is of type: ${type}`);
      assert.notOk(property.isEnumerated, 'property is *not* enumerated');
    });
    (0, _qunit.test)('enumerated property', function (assert) {
      const name = 'Enumerated Property';
      const type = _property.PropertyType.Enumer;
      const store = this.owner.lookup('service:store');
      const property = store.createRecord('property', {
        name,
        type
      });
      assert.equal(property.name, name, `property name is ${name}`);
      assert.equal(property.type, type, `property is of type: ${type}`);
      assert.ok(property.isEnumerated, 'property *is* enumerated');
    });
  });
});
define("condition-editor/tests/unit/models/property-value-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Model | property value', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('holds value', function (assert) {
      const value = 'foo';
      const store = this.owner.lookup('service:store');
      const propertyValue = store.createRecord('property-value', {
        value
      });
      assert.equal(propertyValue.value, value, 'value is held');
    });
  });
});
define('condition-editor/config/environment', [], function() {
  var prefix = 'condition-editor';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('condition-editor/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
