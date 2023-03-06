import React from 'react'
import AppContext from '../AppContext'
import { useEffect,useContext,useState } from 'react'
import { Typography } from '@mui/material';
import MyOrderCard from './MyOrderCard';

function MyOrders() {
  
    const [
        userdata,
        setUserData,
        isadmin,
        db,
        cart,
        setCart,
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
        setUserState,
        phonenumber,
        setPhoneNumber,
        orders,
        setOrders,
      ] = useContext(AppContext);

      const [reversedOrders, setReversedOrders] = useState([])

    useEffect(() => {
      setReversedOrders([...orders].reverse())
    }, [orders]);


    
    return (
    <React.Fragment>
        <div className='flex justify-center'>
            <Typography variant='h2'>My Orders</Typography>
        </div>
       {reversedOrders.map((order) => {
        return(<MyOrderCard key={order.reference} order={order}/>)
       })}
    </React.Fragment>
  )
}

export default MyOrders
