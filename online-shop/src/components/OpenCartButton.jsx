import React from 'react'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import { CartContext } from './CartContext'
import { useContext,useEffect, useState } from 'react'
import productinfo from './product_info'
import { Typography } from '@mui/material'
import CartModal from './CartModal'
import ContextOpenCart from './ContextOpenCart'
import { Outlet, useLocation } from "react-router-dom";
import AppContext from '../AppContext'
import CircularProgress from '@mui/material/CircularProgress';



const OpenCartButton = () => {

    let [totalPrice, setTotalPrice] = useState(0)
    let [openCart, setOpenCart] = useState(false)
    let [finalCartData, setFinalCartData] = useState([])
    let [cart,setCart,products] = useContext(CartContext)
    const location = useLocation();
    const [
        userdata,
        setUserData,
        isadmin,
        db,
        ,
        ,
        favoriteitems,
        setFavoriteItems,
        userId,
        setUserId,
        refreshUser,
        setRefreshUser,
        userLoaded,
        setUserLoaded,
        deliveryaddress,
        setDeliveryAddress,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        userstate,
        setUserState
    ] = useContext(AppContext)

    function AddToCart(product) {

        setCart([...cart, product])

    }

    


    function RemoveFromCart(product) {
        let toRemove = cart.indexOf(product)
        let cartCopy = [...cart]

        if (toRemove > -1) {
            cartCopy.splice(toRemove, 1)
        }

        setCart(cartCopy)
    }

    function ManipulateCartData() {

        //get unique items of array
        function set(arr) {
            return [...new Set(arr)]
        }

        let unique_items = set(cart)
        


        let cart_data = []
        unique_items.map((item, index) => { 
            cart_data.push({itemid: item, quantity: 0})
        })

        cart_data.map((item, index) => {
            cart.map((cart_item, index) => {
                if (item.itemid === cart_item) {
                    item.quantity += 1
                }
            })
        })
    
        return cart_data
    }

    function GetPricePerProduct() {
        
        let prices = []
        ManipulateCartData().map((item, index) => {
            products.map((product, index) => {
                if (item.itemid === product.itemid) {
                    prices.push({itemimage:product.imagelinks[0], itemname:product.itemname,itemid:item.itemid,quantity:item.quantity,price:product.price,total:product.price * item.quantity,addbutton:<button onClick={() => AddToCart(item.itemid)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" >+</button>,removebutton:<button onClick={() => RemoveFromCart(item.itemid)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">-</button>})
                }
            })
        })
        

        // Get Total Price
        let total_price = 0
        
        console.log(prices)
        prices.map((item, index) => {
            total_price += item.total
        })

        setTotalPrice(total_price)
        setFinalCartData(prices)
    
    }

    useEffect(() => {
        GetPricePerProduct()},[cart])

    useEffect(() => {
        setRefreshUser(!refreshUser)
    },[])



    function GetQuantity(){
        return cart.length
    }

    function ViewCart(){
        setOpenCart(true)
    }

    function CloseCart(){
        setOpenCart(false)
    }

  
      

  return (
    <div>
        <div className='flex position fixed bottom-5 w-full justify-center '>
            <button id='opencartbutton' onClick={ViewCart} className="bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full w-2/4 lg:w-1/5 xl:w-72 2xl:w-1/6 position fixed bottom-2 content-center hover:animate-bounce"> 
                    {(userstate !== 'userloading')  ? 
                    <div className='flex flex-row justify-around'>
                        <div>
                            <span className="flex h-3 w-3">
                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{GetQuantity()}</span>
                            </span>
                            <AiOutlineShoppingCart size={30}/>
                        </div>
                        <div className='mt-1.5'>
                            <Typography variant='h6'> Php {totalPrice.toLocaleString()} </Typography> 
                            
                        </div>
                    </div> : <CircularProgress />}
            </button>
        </div>
        <div>
            <ContextOpenCart.Provider value={[openCart,setOpenCart,finalCartData,totalPrice]}>
                <CartModal/>
            </ContextOpenCart.Provider>
        </div>
    </div>
  )
}

export default OpenCartButton
