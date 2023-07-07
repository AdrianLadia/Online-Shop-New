import React, {useEffect, useState} from 'react'
import dataManipulation from './dataManipulation'

const CustomerDropdown = ({data, setChosen}) => {

    // const data = props.data
    const datamanipulation = new dataManipulation()
    const [ customers, setCustomers ] = useState([])
    const [ chosenCustomer, setChosenCustomer ] = useState([])
    const [ inputText, setInputText ] = useState([])

    useEffect(()=>{
      setCustomers(datamanipulation.getAllCustomers( data ))
    }, [data])

    const handleInputText = (event) => {
      const input = event.target.value;
      const suggestions = customers.filter((s)=>{
          return s.toLowerCase().includes(input.toLowerCase())
      });
      if(input === ""){
          setInputText([]);
      }else{
          setInputText(suggestions);
      }
    };

  return (
    <div className='h-full w-full ' >
      <div className='h-9/10 w-full flex justify-center items-end p-1'>
        <input 
          className='w-1/10 md:w-3/10 p-3 text-center border-2 text-blue1 border-color10b hover:border-blue1 focus:border-blue1 outline-none placeholder:text-color10b rounded-lg relative'
          placeholder='Select Customer First'
          value={chosenCustomer}
          onChange={(e)=> {setChosenCustomer(e.target.value), setChosen(e.target.value), handleInputText(e)}}
        />
      </div>
      {inputText.length != 0 &&(
        <div className='absolute left-0 top-25 h-32 w-full flex flex-col items-center z-50 '>
          <div className='overflow-auto w-1/10 border-y border-color10b bg-white rounded-lg px-1'>
            {inputText.slice(0,10).map((data, index)=>{
              return(
                <div className='border-b border-color10b z-50'>
                    <button className='z-50 border-color10b  w-64 p-3 hover:bg-color10b hover:text-white'
                      onClick={() => {setChosenCustomer(data), setChosen(data), setInputText([])}}
                      key={index}
                    > {data} </button> 
                </div>
              )
            })}
          </div>
        </div> 
      )}
    </div>
  )
}

export default CustomerDropdown