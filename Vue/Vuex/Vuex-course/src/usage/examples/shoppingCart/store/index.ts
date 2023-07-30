import { CartState } from "./modules/cart";
import { ProductsState } from "./modules/products";
import { createStore } from "vuex";

export interface State {
  cartState: CartState;
  productsState: ProductsState;
}
export default createStore<State>({
  modules: {
    cartModule,
    productsModule,
  },
});
