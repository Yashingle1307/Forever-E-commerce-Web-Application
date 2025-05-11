import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')
  const { cartItems, setCartItems, getCartAmount, delivery_fee, products, navigate, token,backendUrl } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  const initPay=(order)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:"Order Payment",
      description:"Order Payment",
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        // console.log(response);
        try{
          const {data}=await axios.post(backendUrl+'/api/order/verifyRazorpay',{response},{headers: {Authorization: `Bearer ${token}`},});
          if(data.success){
            navigate('/orders');
            setCartItems({});
          }
        }catch(error)
        {
          console.log(error);
          toast.error(error);
        }
      }
    }
    const rzp = new window.Razorpay(options); // Ensure Razorpay script is loaded globally
    rzp.open();
  };

  const onSubmitHandler = async (event) => {

    event.preventDefault()
      
    try {

      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            
            const product = products.find(p => p._id === items);
              const itemInfo = structuredClone(product);

              if(itemInfo){
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);

              }
          }
        }
      }

      let orderData = {
        userId: localStorage.getItem('userId'),
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
     
      // Now handle API call
      
      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {Authorization: `Bearer ${token}`},});

          if (response.data.success) {
            setCartItems({});
            toast.success('Order placed successfully!')
            navigate('/orders');

          } 
          else {
            toast.error(response.data.message);
          }
          break;
      
        case 'stripe':
          toast.error('Stripe payment integration is not done yet!');
          break;
      
        case 'razorpay':
          const responserazorpay=await axios.post(backendUrl+'/api/order/razorpay',orderData,{headers:{
                Authorization: `Bearer ${token}`
                }})

           if (responserazorpay.data.success) {
            initPay(responserazorpay.data.order)
           } 
          break;
      
        default:
          toast.error('Please select a valid payment method.');
      }
    }
    catch (error) {
      console.log(error)
      toast.error(error.message)
    }

}
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side: Delivery Info */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1='DELIVERY' text2='INFORMATION' />
        </div>

        <div className='flex gap-3'>
          <input required name='firstName' value={formData.firstName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='First name' />
          <input required name='lastName' value={formData.lastName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Last name' />
        </div>
        <input required name='email' value={formData.email} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Email Address' />
        <input required name='street' value={formData.street} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Street' />

        <div className='flex gap-3'>
          <input required name='city' value={formData.city} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='City' />
          <input required name='state' value={formData.state} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='State' />
        </div>

        <div className='flex gap-3'>
          <input required name='zipcode' type='number' value={formData.zipcode} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Zip Code' />
          <input required name='country' value={formData.country} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Country' />
        </div>

        <input required name='phone' type='tel' value={formData.phone} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Phone Number' />
      </div>

      {/* Right side: Order Summary & Payment */}
      <div className='mt-8'>
        <div className='min=8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1='PAYMENT' text2='METHOD' />

          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`} />
              <img className='h-5 mx-4' src={assets.stripe_logo} alt='Stripe' />
            </div>

            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`} />
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt='Razorpay' />
            </div>

            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`} />
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
