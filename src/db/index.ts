import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './schema';
import {modelClasses} from './models';

export const database = new Database({
  adapter: new SQLiteAdapter({schema, jsi: true}),
  modelClasses,
});
