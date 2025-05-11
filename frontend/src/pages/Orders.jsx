import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';  // Make sure toast is imported

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);

    const loadOrderData = async () => {

        if (!token) {
            toast.error('No token found, please login.');
            return;
        }

        try {

            const response = await axios.post(
                backendUrl + '/api/order/userOrders',
                {}, // <-- empty body
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {

                const orders = response.data.orders || [];

                let allOrdersItem = [];

                if (orders.length > 0) {
                    orders.map((order) => {
                        order.items.map((item) => {
                            item['status'] = order.status;
                            item['payment'] = order.payment;
                            item['paymentMethod'] = order.paymentMethod;
                            item['date'] = order.date;
                            allOrdersItem.push(item);
                        });
                    });
                }

                console.log(allOrdersItem);
                setOrderData(allOrdersItem);

            }
            else {
                toast.error("Failed to load orders");
            }

        }
        catch (error) {
            console.error('Error loading orders:', error);
            toast.error('An error occurred while fetching orders.');
        }
    }

    useEffect(() => {
        if (token) {
            loadOrderData();
        }
    }, [token]);

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'MY '} text2={'ORDERS'} />
            </div>

            <div>
                {orderData.length === 0 ? (
                    <p>No orders available.</p>
                ) : (
                    orderData.map((item, index) => (
                        <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                            <div className='flex items-start gap-6 text-sm'>
                                <img className='w-16' src={item.image[0]} alt={item.name} />
                                <div>
                                    <p className='sm:text-base font-medium'>{item.name}</p>
                                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                                        <p className='text-lg'>{currency}{item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                    </div>
                                    <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toLocaleDateString()}</span></p>
                                    <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                                </div>
                            </div>

                            <div className='md:w-1/2 flex justify-between'>
                                <div className='flex items-center gap-2'>
                                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                    <p className='text-sm md:text-base'>{item.status}</p>
                                </div>
                                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;
