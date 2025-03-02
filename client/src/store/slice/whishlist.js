import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialState = {
    wishlist: [],
    status: 'idle',
    error: null,
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://api.dyfru.com/api/v1/wishlist', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token_login')}`,
                },
            });
            console.log("response",response.data.data.items)
          
            return response.data.data.items;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (item, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://api.dyfru.com/api/v1/add-whishlist', item, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token_login')}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error adding item to wishlist:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchWishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.wishlist = action.payload;

                // toast.success('Wishlist fetched successfully!');
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
              
            })

            // Handle addToWishlist
            .addCase(addToWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log("Actions: " + action.payload)
                state.wishlist.push(action.payload);
                toast.success(action.payload.message);  
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                toast.error('Failed to add product to wishlist.');
            });
    },
});

export default wishlistSlice.reducer;
