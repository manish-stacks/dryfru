import { combineReducers } from '@reduxjs/toolkit';
import wishlistReducer from '../slice/whishlist'
import cartReducer from '../slice/cart.slice'
const rootReducer = combineReducers({
    whishlist: wishlistReducer,
    cart:cartReducer
});

export default rootReducer;