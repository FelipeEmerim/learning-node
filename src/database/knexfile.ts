import * as path from 'path';
import { knexConfigs } from '../config/knex/knex.config';

knexConfigs.migrations = knexConfigs.migrations ?? {};
knexConfigs.seeds = knexConfigs.seeds ?? {};

knexConfigs.migrations.directory = path.join(__dirname, 'migrations');
knexConfigs.seeds.directory = path.join(__dirname, 'seeds');

export default knexConfigs;
