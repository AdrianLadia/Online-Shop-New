import React, {useEffect, useState} from 'react'

const Favorites = (props) => {

    const items = props.items;
    const favorites = props.favorites;
    console.log(favorites)
    const [toShow, setToShow] = useState(0) 

    console.log(items)
    console.log(favorites)
    
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