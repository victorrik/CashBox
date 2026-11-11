import React, {createContext, useContext, useMemo, useReducer} from 'react';
import type {Customer, Product} from '../hooks';

export type CartItem = {productId: string; name: string; price: number; quantity: number; maxStock: number};
type State = {items: CartItem[]; note: string; customer: Customer | null};
type Action =
  | {type: 'add'; product: Product}
  | {type: 'increment' | 'decrement' | 'remove'; productId: string}
  | {type: 'note'; note: string}
  | {type: 'customer'; customer: Customer | null}
  | {type: 'clear'};

export const empty: State = {items: [], note: '', customer: null};

export function reducer(state: State, a: Action): State {
  switch (a.type) {
    case 'add': {
      const p = a.product;
      if (p.stock <= 0) return state;
      const found = state.items.find(i => i.productId === p.id);
      if (!found) {
        return {...state, items: [...state.items, {productId: p.id, name: p.name, price: p.price, quantity: 1, maxStock: p.stock}]};
      }
      return reducer(state, {type: 'increment', productId: p.id});
    }
    case 'increment':
      return {...state, items: state.items.map(i => (i.productId === a.productId && i.quantity < i.maxStock ? {...i, quantity: i.quantity + 1} : i))};
    case 'decrement': // reaching 0 removes the item
      return {...state, items: state.items.flatMap(i => (i.productId !== a.productId ? [i] : i.quantity > 1 ? [{...i, quantity: i.quantity - 1}] : []))};
    case 'remove':
      return {...state, items: state.items.filter(i => i.productId !== a.productId)};
    case 'note':
      return {...state, note: a.note};
    case 'customer':
      return {...state, customer: a.customer};
    case 'clear':
      return empty;
  }
}

const Ctx = createContext<ReturnType<typeof build> | null>(null);

function build(state: State, dispatch: React.Dispatch<Action>) {
  return {
    ...state,
    total: Math.round(state.items.reduce((t, i) => t + i.price * i.quantity, 0) * 100) / 100,
    itemCount: state.items.reduce((t, i) => t + i.quantity, 0),
    quantityOf: (id: string) => state.items.find(i => i.productId === id)?.quantity ?? 0,
    add: (product: Product) => dispatch({type: 'add', product}),
    increment: (productId: string) => dispatch({type: 'increment', productId}),
    decrement: (productId: string) => dispatch({type: 'decrement', productId}),
    remove: (productId: string) => dispatch({type: 'remove', productId}),
    setNote: (note: string) => dispatch({type: 'note', note}),
    setCustomer: (customer: Customer | null) => dispatch({type: 'customer', customer}),
    clear: () => dispatch({type: 'clear'}),
  };
}

export function CartProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(reducer, empty);
  const value = useMemo(() => build(state, dispatch), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
}
