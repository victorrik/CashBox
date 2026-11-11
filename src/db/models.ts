import {Model} from '@nozbe/watermelondb';
import {date, field, readonly} from '@nozbe/watermelondb/decorators';

export class StoreModel extends Model {
  static table = 'stores';
  @field('name') name!: string;
  @field('logo') logo?: string | null;
  @field('onboarded') onboarded!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('deleted_at') deletedAt?: Date | null;
}

export class CategoryModel extends Model {
  static table = 'categories';
  @field('name') name!: string;
  @field('color') color!: string;
  @field('image') image?: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('deleted_at') deletedAt?: Date | null;
}

export class ProductModel extends Model {
  static table = 'products';
  @field('sku') sku!: string;
  @field('name') name!: string;
  @field('price') price!: number;
  @field('stock') stock!: number;
  @field('min_stock') minStock?: number | null;
  @field('image') image?: string | null;
  @field('category_id') categoryId?: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('deleted_at') deletedAt?: Date | null;
}

export class ProductHistoryModel extends Model {
  static table = 'product_histories';
  @field('product_id') productId!: string;
  @field('event_type') eventType!: 'stock_update' | 'sale' | 'sale_cancelled';
  @field('quantity_change') quantityChange!: number;
  @field('stock_before') stockBefore!: number;
  @field('stock_after') stockAfter!: number;
  @field('note') note?: string | null;
  @field('sale_id') saleId?: string | null;
  @readonly @date('created_at') createdAt!: Date;
}

export class CustomerModel extends Model {
  static table = 'customers';
  @field('name') name!: string;
  @field('phone') phone?: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('deleted_at') deletedAt?: Date | null;
}

export class SaleModel extends Model {
  static table = 'sales';
  @field('customer_id') customerId?: string | null;
  @field('total') total!: number;
  @field('change') change!: number;
  @field('status') status!: 'paid' | 'debt';
  @field('note') note?: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('deleted_at') deletedAt?: Date | null;
}

export class SaleItemModel extends Model {
  static table = 'sale_items';
  @field('sale_id') saleId!: string;
  @field('product_id') productId?: string | null;
  @field('product_name') productName!: string;
  @field('price_at_sale') priceAtSale!: number;
  @field('quantity') quantity!: number;
  @field('subtotal') subtotal!: number;
  @readonly @date('created_at') createdAt!: Date;
}

export class PaymentModel extends Model {
  static table = 'payments';
  @field('sale_id') saleId!: string;
  @field('amount') amount!: number;
  @readonly @date('created_at') createdAt!: Date;
}

export const modelClasses = [
  StoreModel,
  CategoryModel,
  ProductModel,
  ProductHistoryModel,
  CustomerModel,
  SaleModel,
  SaleItemModel,
  PaymentModel,
];
