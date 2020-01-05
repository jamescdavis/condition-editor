import { Server } from 'ember-cli-mirage';
import { loadProperties, loadProducts } from '../util';

export default function(server: Server): void {
    loadProperties(server);
    loadProducts(server);
}
