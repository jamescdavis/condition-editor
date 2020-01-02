'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    const app = new EmberApp(defaults, {
        hinting: false,
    });

    app.import('vendor/datastore.js');

    return app.toTree();
};
