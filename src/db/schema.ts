import {appSchema, tableSchema} from '@nozbe/watermelondb';

const stamps = [
  {name: 'created_at', type: 'number'},
  {name: 'updated_at', type: 'number'},
  {name: 'deleted_at', type: 'number', isOptional: true},
] as const;

// shortcut: single store per install (no store_id on other tables), upgrade if multi-store is needed
export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'stores',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'logo', type: 'string', isOptional: true},
        {name: 'onboarded', type: 'boolean'},
        ...stamps,
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'image', type: 'string', isOptional: true},
        ...stamps,
      ],
    }),
    tableSchema({
      name: 'products',
      columns: [
        {name: 'sku', type: 'string', isIndexed: true},
        {name: 'name', type: 'string'},
        {name: 'price', type: 'number'},
        {name: 'stock', type: 'number'},
        {name: 'min_stock', type: 'number', isOptional: true},
        {name: 'image', type: 'string', isOptional: true},
        {name: 'category_id', type: 'string', isOptional: true, isIndexed: true},
        ...stamps,
      ],
    }),
    tableSchema({
      name: 'product_histories',
      columns: [
        {name: 'product_id', type: 'string', isIndexed: true},
        {name: 'event_type', type: 'string'}, // stock_update | sale | sale_cancelled
        {name: 'quantity_change', type: 'number'},
        {name: 'stock_before', type: 'number'},
        {name: 'stock_after', type: 'number'},
        {name: 'note', type: 'string', isOptional: true},
        {name: 'sale_id', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'customers',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'phone', type: 'string', isOptional: true},
        ...stamps,
      ],
    }),
    tableSchema({
      name: 'sales',
      columns: [
        {name: 'customer_id', type: 'string', isOptional: true, isIndexed: true},
        {name: 'total', type: 'number'},
        {name: 'change', type: 'number'},
        {name: 'status', type: 'string'}, // paid | debt
        {name: 'note', type: 'string', isOptional: true},
        ...stamps,
      ],
    }),
    tableSchema({
      name: 'sale_items',
      columns: [
        {name: 'sale_id', type: 'string', isIndexed: true},
        {name: 'product_id', type: 'string', isOptional: true},
        {name: 'product_name', type: 'string'},
        {name: 'price_at_sale', type: 'number'},
        {name: 'quantity', type: 'number'},
        {name: 'subtotal', type: 'number'},
        {name: 'created_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'payments',
      columns: [
        {name: 'sale_id', type: 'string', isIndexed: true},
        {name: 'amount', type: 'number'},
        {name: 'created_at', type: 'number'},
      ],
    }),
  ],
});
