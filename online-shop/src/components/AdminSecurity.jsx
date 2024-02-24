import React from 'react'
import {useContext } from 'react'
import AppContext from '../AppContext'
import Admin from './Admin'



const AdminSecurity = () => {
    
    // Check if admin
    const {isAdmin} = useContext(AppContext)
    
  
    return (
    <div>
        {
        isAdmin 
            ? 
        <div className='flex flex-col'>
            {/* AdminNavBar */}
            <Admin />
        </div> 
            : 
        'Cannot Access this page without admin rights'
        }
    </div>
  )
}

export default AdminSecurity
