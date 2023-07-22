import React, {useEffect, useState} from 'react'

const Favorites = (props) => {

    const items = props.items;
    const favorites = props.favorites;
    const [toShow, setToShow] = useState(0) 
    
    useEffect(()=>{
     favorites.map((s)=>{
        if(s.itemname == items){
           setToShow(s.score)
        }
     })
    },[])
    
  return (
    <div>
        {toShow}
    </div>
  )
}

export default Favorites