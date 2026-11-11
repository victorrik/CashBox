import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'transactions',
      columns: [
        {name: 'concept', type: 'string'},
        {name: 'amount', type: 'number'},
        {name: 'created_at', type: 'number'},
      ],
    }),
  ],
});
