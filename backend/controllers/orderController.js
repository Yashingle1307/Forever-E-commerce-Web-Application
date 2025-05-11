import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import razorpay from 'razorpay'
import crypto from "crypto";

const currency = 'INR'
const deliveryCharge = 10


const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const placeOrder = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    if (!items || !amount || !address) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found when updating cart" });
    }

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `Error placing order: ${error.message}` });
  }
};


// placing order using stripe 
const placeOrderStripe = async (req, res) => {

  // const responseStripe =awiat axios.post()

}

const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Razorpay',
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: newOrder._id.toString()
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });

  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const verifyRazorpay = async (req, res) => {
  try {

    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;

    console.log( req.body.response);
    console.log(userId);

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature. Payment verification failed.' });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({ success: true, message: 'Payment Successful' });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during payment verification.' });
  }
};


// All orders data for admin panel 
const allOrders = async (req, res) => {

  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders })
  }
  catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// User order data for frontends
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;  
    console.log('User ID:', userId);  
    const orders = await orderModel.find({ userId });

    if (!orders) {
      return res.json({ success: false, message: 'No orders found.' });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);  // Detailed error logging
    res.json({ success: false, message: error.message || 'Error fetching orders' });
  }
};


// update order status 
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: "Status Updated" })
  }
  catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}

export { verifyRazorpay, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }