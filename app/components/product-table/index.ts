import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import Ember from 'ember';
import DS from 'ember-data';

import Operator from 'condition-editor/lib/operator';
import ProductModel from 'condition-editor/models/product';
import PropertyModel from 'condition-editor/models/property';

interface ProductQuery {
    include: string;
    property?: string;
    operator?: string;
    filter?: string;
}

interface Args {
    property?: PropertyModel;
    operator?: Operator;
    filter?: string;
}

export default class ProductTableComponent extends Component<Args> {
    @service store!: DS.Store;

    @tracked products?: Ember.ArrayProxy<ProductModel>;

    @task({ restartable: true })
    loadProducts = task(function*(this: ProductTableComponent) {
        const query: ProductQuery = {
            include: 'propertyValues.property',
        };
        if (this.args.property) {
            query.property = this.args.property.id;
        }
        if (this.args.operator) {
            query.operator = this.args.operator.id;
        }
        if (this.args.filter) {
            query.filter = this.args.filter;
        }
        this.products = yield this.store.query('product', query);
    });

    @action onOperatorUpdate(): void {
        if (this.args.operator && !this.args.operator.needsInput) {
            this.loadProducts.perform();
        }
    }

    @action onFilterUpdate(): void {
        this.loadProducts.perform();
    }
}
