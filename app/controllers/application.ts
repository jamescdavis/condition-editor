import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import Ember from 'ember';
import { task } from 'ember-concurrency-decorators';

import PropertyModel from 'condition-editor/models/property';

export default class ApplicationController extends Controller {
    @tracked properties?: Ember.ArrayProxy<PropertyModel>;

    @task({ on: 'init', restartable: true })
    loadProperties = task(function*(this: ApplicationController) {
        this.properties = yield this.store.findAll('property');
    });
}
