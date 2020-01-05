import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import Application from 'condition-editor/app';
import config from '../config/environment';
import 'qunit-dom';

setApplication(Application.create(config.APP));

start();
