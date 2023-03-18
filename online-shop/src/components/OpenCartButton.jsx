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
import businessCalculations from '../../utils/businessCalculations'
import dataManipulation from '../../utils/dataManipulation'



const OpenCartButton = () => {

    const businesscalculations = new businessCalculations()
    const datamanipulation = new dataManipulation()
    let [totalPrice, setTotalPrice] = useState(0)
    let [openCart, setOpenCart] = useState(false)
    let [finalCartData, setFinalCartData] = useState([])
    let [cart,setCart,products] = useContext(CartContext)
    const location = useLocation();
    const {
        refreshUser,
        setRefreshUser,
        userstate,
     } = useContext(AppContext)

    function onAddToCartClick(product) {
        const newCart = businesscalculations.addToCart(cart,product)
        console.log(newCart)
        setCart(newCart)

    }

    function RemoveFromCart(product) {
        const newCart = businesscalculations.removeFromCart(cart,product)
        setCart(newCart)
    }

    function GetPricePerProduct() {
        let prices = []
            datamanipulation.manipulateCartData(cart).map((item, index) => {
            products.map((product, index) => {
                if (item.itemid === product.itemid) {
                    prices.push({itemimage:product.imagelinks[0], itemname:product.itemname,itemid:item.itemid,quantity:item.quantity,price:product.price,total:product.price * item.quantity,addbutton:<button onClick={() => onAddToCartClick(item.itemid)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" >+</button>,removebutton:<button onClick={() => RemoveFromCart(item.itemid)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">-</button>})
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
