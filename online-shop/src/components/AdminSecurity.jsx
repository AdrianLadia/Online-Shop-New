import React from 'react'
import { useState,useEffect,useContext } from 'react'
import AppContext from '../AppContext'
import AdminMenu from './AdminMenu'


const AdminSecurity = () => {
    
    // Check if admin
    const {isadmin} = useContext(AppContext)
  
    return (
    <div>
        {
        isadmin 
            ? 
        <div className='flex flex-col'>
            {/* AdminNavBar */}
            <AdminMenu />
        </div> 
            : 
        'Cannot Access this page without admin rights'
        }
    </div>
  )
}

export default AdminSecurity
