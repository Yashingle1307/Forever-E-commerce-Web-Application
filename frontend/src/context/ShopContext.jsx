import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider =  ({ children }) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setshowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        let cartData = structuredClone(cartItems)

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size },{headers:{
                Authorization: `Bearer ${token}`
                }})
            }
            catch (error) {
                console.log(error);
                toast.error(error.message)
            }

        }
    }

    const getCartCount = () => {
        let totalCount = 0;

        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        return totalCount;
    };


    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if(token){
            try{
                 
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity },{headers:{
                Authorization: `Bearer ${token}`
                }})
            }
            catch(error){
                console.log(error);
                toast.error(error.message)
            }

        }
      
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
          const itemInfo = products.find(product => product._id === itemId);
          if (!itemInfo) continue;  // skip if product info not found
      
          for (const size in cartItems[itemId]) {
            const quantity = cartItems[itemId][size];
            if (quantity > 0) {
              totalAmount += itemInfo.price * quantity;
            }
          }
        }
        return totalAmount;
      };
      
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error("Failed to fetch product data:", error);
        }

    };

    useEffect(() => {
        getProductData();
    }, [])


    const getUserCart=async(token)=>{

        try{
            const response=await axios.post(backendUrl+'/api/cart/get',{},{headers:{
                Authorization: `Bearer ${token}`
                }})

            if(response.data.success)
            {
                setCartItems(response.data.cartData);
            }
            
        }catch(error){
            console.log(error);
            toast.error(error.message)
        }
    }


    useEffect(() => {

        const savedToken = localStorage.getItem("token"); 
        
        if (savedToken && !token) {
            setToken(savedToken);
            getUserCart(savedToken);
        }

    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setshowSearch,
        cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate,
        backendUrl, token, setToken, setCartItems 
    };
    
    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
