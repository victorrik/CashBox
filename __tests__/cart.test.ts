import {empty, reducer} from '../src/cart/CartContext';

const p = {id: 'a', sku: 'A', name: 'A', price: 10, stock: 2, minStock: null, categoryId: null};

test('add respects stock limit and decrement removes at zero', () => {
  let s = reducer(empty, {type: 'add', product: p});
  s = reducer(s, {type: 'add', product: p});
  s = reducer(s, {type: 'add', product: p}); // over stock, ignored
  expect(s.items[0].quantity).toBe(2);
  s = reducer(s, {type: 'decrement', productId: 'a'});
  s = reducer(s, {type: 'decrement', productId: 'a'});
  expect(s.items).toHaveLength(0);
});

test('out of stock product is not added', () => {
  expect(reducer(empty, {type: 'add', product: {...p, stock: 0}}).items).toHaveLength(0);
});
