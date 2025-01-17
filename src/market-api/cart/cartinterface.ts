export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
}
