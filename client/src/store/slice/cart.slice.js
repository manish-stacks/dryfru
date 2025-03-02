import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    cart: []
};

// Load cart from sessionStorage
const loadCartFromSessionStorage = () => {
    const serializedCart = sessionStorage.getItem('cart');
    if (serializedCart) {
        return JSON.parse(serializedCart);
    }
    return [];
};

const cartStateFromStorage = loadCartFromSessionStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: cartStateFromStorage || []  // Ensure cart is an empty array if nothing is loaded from sessionStorage
    },
    reducers: {
        addProduct: (state, action) => {
            const product = action.payload;

            // Initialize product quantity if it's not already set
            const productWithQuantity = {
                ...product,
                quantity: product.quantity || 1  // Default to 1 if quantity is not specified
            };

            // Check if the product already exists in the cart
            const existingProduct = state.cart.find(item => item.product_id === productWithQuantity.product_id && item.variant === productWithQuantity.variant);

            if (existingProduct) {
                // If the product exists, just update the quantity
                existingProduct.quantity += productWithQuantity.quantity;
            } else {
                // If product doesn't exist, add to the cart
                state.cart.push(productWithQuantity);
            }
        },
        updateQuantity: (state, action) => {
            const { id, variant, quantity } = action.payload;
        
            console.log("Payload:", id, variant, quantity);
        
            // Find the product in the cart
            const product = state.cart.find(item => item.product_id === id && item.variant === variant);
        
            console.log("Product Found:", JSON.parse(JSON.stringify(product)));

        
            if (product) {
                if (quantity < 1) {
                  
                    state.cart = state.cart.filter(item => !(item.product_id === id ));
                    console.log("Product Removed. Updated Cart:", state.cart);
                } else {
                    // Otherwise, update the quantity
                    product.Qunatity = quantity;
                    console.log("After Update:", JSON.parse(JSON.stringify(product)));
                }
            } else {
                console.log("No matching product found in the cart.");
            }
        },
        
        getAllCart: (state) => {
            return state.cart;
        }
    }
});

export const { addProduct, updateQuantity, getAllCart } = cartSlice.actions;

export default cartSlice.reducer;

// Middleware to sync cart with sessionStorage
const syncWithSessionStorage = store => next => action => {
    const result = next(action);
    sessionStorage.setItem('cart', JSON.stringify(store.getState().cart.cart));
    return result;
};

export { syncWithSessionStorage };