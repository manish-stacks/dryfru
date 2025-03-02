import axios from 'axios';

export const findMyDetails = async () => {
    try {
        const { data } = await axios.get('https://api.dyfru.com/api/v1/my-details', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token_login')}`,
            },
        });
        if (data && data.data) {
            return data.data;
        }
        throw new Error('User not found');
    } catch (error) {
        console.error(error);
        sessionStorage.clear();
        // window.location.href = '/login';
        throw new Error('Login First');
    }
};

export const findMarqueee = async () => {


    try {
        const { data } = await axios.get('https://api.dyfru.com/api/v1/admin/annoncements');
        console.log("found", data.data);
        return data.data

    } catch (error) {
        console.error("findMarqueeefindMarqueeefindMarqueee", error);

    }
};
export const findNavs = async () => {
    try {
        const { data } = await axios.get('https://api.dyfru.com/api/v1/admin/category');
        console.log("Categories", data);
        return data.categories

    } catch (error) {
        console.error("findNavs", error);

    }
};

export const findMyLastOrder = async () => {
    try {
        const { data } = await axios.get('https://api.dyfru.com/api/v1/my-last-order', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token_login')}`,
            },
        });
        if (data && data.order) {
            return data.order;
        }
        // throw new Error('Order not found');
    } catch (error) {
        console.error(error);

        // throw new Error('Login First');
    }
};

export const findSettings = async () => {
    try {
        const { data } = await axios.get('https://api.dyfru.com/api/v1/admin/settings');
        if (data && data.data) {
            return data.data;
        }
        throw new Error('Settings not found');
    } catch (error) {
        console.error(error);

        // throw new Error('Login First');
    }
};

export const findMyAllOrders = async () => {
    try {
        const { data } = await axios.get('https://api.dyfru.com/api/v1/my-all-order', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token_login')}`,
            },
        });

        if (data && data.order) {
            // Filter only orders with 'paid' status or COD payment type
            const filteredOrders = data.order.filter(
                (item) => item.payment?.status === 'paid' || item.paymentType === 'COD'
            );
            return filteredOrders;
        }

        throw new Error('No orders found');
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        return []; // Return empty array instead of crashing the app
    }
};



export const ApiHandleLogout = async () => {
    try {
        const { data } = await axios.get('https://api.dyfru.com/api/v1/logout', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token_login')}`,
            },
        });
        if (data && data.success) {
            return data.success;
        }
        throw new Error('Settings not found');
    } catch (error) {
        console.error(error);

        // throw new Error('Login First');
    }
};
