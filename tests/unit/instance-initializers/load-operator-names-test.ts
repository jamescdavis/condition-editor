import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';

import { initialize } from 'condition-editor/instance-initializers/load-operator-names';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import { TestContext } from 'ember-test-helpers';

import { getOperator } from 'condition-editor/lib/operator';

interface Context extends TestContext {
    TestApplication: typeof Application;
    application: Application;
    instance: ApplicationInstance;
}

module('Unit | Instance Initializer | load-operator-names', function(hooks) {
    hooks.beforeEach(function(this: Context) {
        this.TestApplication = Application.extend();
        this.TestApplication.instanceInitializer({
            name: 'initializer under test',
            initialize,
        });
        this.application = this.TestApplication.create({ autoboot: false });
        this.instance = this.application.buildInstance();
    });

    hooks.afterEach(function(this: Context) {
        run(this.instance, 'destroy');
        run(this.application, 'destroy');
    });

    test('names loaded from datastore', async function(this: Context, assert) {
        await this.instance.boot();

        window.datastore
            .getOperators()
            .forEach(operator =>
                assert.equal(getOperator(operator.id).text, operator.text, `${operator.id} -> "${operator.text}"`),
            );
    });
});
