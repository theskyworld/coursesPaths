import { ActionContext } from 'vuex';
import { State } from './../index';


export interface CartState {
    items: Array<any>,
    checkoutStatus :  any,
}

// state
const state: CartState = {
    items: [],
    checkoutStatus : null,
};

// getters
const geters = {
    cartProducts: (state : CartState, getters : any, rootState: State) {
        return state.items.map(({ id, quantity }) => {
            const product = rootState.productsState.all.find(
                product => product.id === id
            );

            return {
                id: product.id,
                title: product.title,
                price: product.price,
                quantity,
            }
        })
    },

    cartTotalPrice: (state : CartState, getters : any) => {
        return getters.cartProducts.reduce((total : number, product) => {
            return total + product.price * product.quantity;
        }, 0)
    }
    
}

// mutations
const mutations = {
    // 添加商品到购物车
    pushProductToCart(state: CartState, paylaod: any) {
        state.items.push({
            paylaod.id,
            quantity : 1,
        })
    },
    // 依据购物车中指定商品的id添加其对应的数量quantity
    increaseItemQuantity(state: CartState, { id }) {
        const cartItem = state.items.find(item => item.id === id);
        cartItem.quantity++;
    },
    // 替换掉整个购物车
    setCartItems(state : CartState, { items }) {
        state.items = items;
    },

    // 设置checkout状态
    setCheckoutStatus(state : CartState, status) {
        state.checkoutStatus = status;
    }
}

// actions
const actions = {
    async checkout({ commit, state } : ActionContext<CartState, State>, products : Array<any>) {
        const savedCartItems = [...state.items];
        commit("")
    }
} 