import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './schema';
import {Transaction} from './Transaction';

export const database = new Database({
  adapter: new SQLiteAdapter({schema, jsi: true}),
  modelClasses: [Transaction],
});
