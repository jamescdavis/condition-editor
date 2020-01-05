import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Server } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';

import { loadProperties } from 'condition-editor/mirage/util';

import ApplicationController from 'condition-editor/controllers/application';

interface Context extends TestContext {
    server: Server;
}

module('Unit | Controller | application', function(hooks) {
    setupTest(hooks);
    setupMirage(hooks);

    test('load properties', async function(this: Context, assert) {
        loadProperties(this.server);
        const controller = this.owner.lookup('controller:application') as ApplicationController;
        await controller.loadProperties.perform();
        assert.equal(controller.properties?.length, 5, 'five properties loaded');
    });
});
