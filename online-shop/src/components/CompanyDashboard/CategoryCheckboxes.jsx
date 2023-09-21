import React, { useEffect } from 'react'

const CategoryCheckboxes = ({categories, setAllowedCategories, allowedCategories}) => {
    
  function handleClick(type){
    if(allowedCategories.includes(type) == true){
      setAllowedCategories(allowedCategories.filter((item)=>item !== type))
    }else{
      setAllowedCategories([...allowedCategories, type])
    }
  }

  return (
    <div className='p-3 rounded-t-lg border border-green-400 h-full w-full grid grid-cols-6 justify-evenly'>
        {categories?categories.map((type, index)=>{
          if (type != 'Favorites'){
            return (
              <div key={type} id='index' className='tracking-wide text-sm flex flex-col justify-center items-center'>
                <input onChange={()=>handleClick(type)} checked={allowedCategories.includes(type)} 
                       className='accent-green-600' id={type} type='checkbox' />
                <label htmlFor={type}>{type}</label>
              </div>
            )
          }
        }):''}
        <div className=' flex justify-center items-center '>
          <button className='py-2 px-4 rounded-lg  border text-red-500 border-red-400 span-2'
            onClick={()=>{setAllowedCategories([])}}
            >Clear
          </button>
        </div>
    </div>
  )
}

export default CategoryCheckboxes