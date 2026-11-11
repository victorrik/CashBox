import {Model} from '@nozbe/watermelondb';
import {date, field} from '@nozbe/watermelondb/decorators';

export class Transaction extends Model {
  static table = 'transactions';
  @field('concept') concept!: string;
  @field('amount') amount!: number;
  @date('created_at') createdAt!: Date;
}
