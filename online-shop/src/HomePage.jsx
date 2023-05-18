import React, {useRef, useEffect, useState} from 'react'
import { BsCartFill } from "react-icons/bs";

const HomePage = () => {
  
  const backgroundImageUrl = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FkMz46WMzlexoqIBGHaHX2gQ2lZo9%2F11584182023-107801%2Fpaper%20products.jpg?alt=media&token=895a3219-b509-4dcf-bdd8-ee8d86327f69';
  const page1 = useRef("p1");
  const page2 = useRef("p2");
  const page3 = useRef("p3");
  const page4 = useRef("p4");
  const page5 = useRef("p5");
  const [selectedPage, setSelectedPage] = useState()

    function scroll(page){
      setSelectedPage(page)
      page.current.scrollIntoView({ behavior: 'smooth' })
    }

    function buttonStyle(){
        return 'w-32 h-full hover:bg-green2 rounded-2xl'
    }

  return (
    <div class="snap-y snap-mandatory h-screen w-screen overflow-y-scroll overflow-x-hidden flex ">

        {/* Navigation Bar */}
        <div className='fixed inset-x-12 top-0 flex justify-between items-center p-10 h-1/10 bg-green3 opacity-70'>
          <div className='w-1/12 flex justify-center'>
            <img src="https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fstarpack.png?alt=media&token=e108388d-74f7-45a1-8344-9c6af612f053" alt="logo"
                className="h-16 w-16 xl:h-20 xl:w-20 rounded-full border-2 border-color30 cursor-pointer"
                onClick={()=>{scroll(page1)}}
                />
          </div>
          <div className='flex justify-evenly w-1/2 gap-0.5 text-lg xl:text-2xl '>
            {/* <div className='border-l-2 border-green1'/>
            <button onClick={()=>{scroll(page1)}} className={buttonStyle()}>Home</button> */}
            <div className='border-l-2 border-green1'/>
            <button onClick={()=>{scroll(page2)}} className={buttonStyle()}>About Us</button>
            <div className='border-l-2 border-green1'/>
            <button onClick={()=>{scroll(page3)}} className={buttonStyle()}>Products</button>
            <div className='border-l-2 border-green1'/>
            <button onClick={()=>{scroll(page4)}} className={buttonStyle()}>Affiliate</button>
            <div className='border-l-2 border-green1'/>
            <button onClick={()=>{scroll(page5)}} className={buttonStyle()}>Contact Us</button>
          </div>
        </div>

        {/* Page 1 */}
        <div 
          ref={page1} className="snap-start w-screen h-screen bg-cover bg-center " 
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),' + `url(${backgroundImageUrl})`}}
          >
            <div className='h-1/10 p-10 w-full flex'/>
            <div className='w-screen h-9/10 flex '>
              <div className='h-full w-1/2 gap-5 flex flex-col justify-center items-center'>
                <div className='h-full w-5/6 flex flex-col justify-center items-center '>
                    <div className='flex flex-col w-3/4 p-3 gap-2'>
                      <h1 className='text-7xl text-color60 font-bold'>Star Pack</h1>
                      <h2 className='text-3xl text-color30'>Your trusted online packaging supplier.</h2>
                      <button 
                        className=' w-4/12 xl:w-3/12 flex ease-in-out duration-300 p-3 mt-4 font-semibold justify-center rounded-xl hover:bg-colorbackground
                                    border-2 border-green3 hover:border-color60 text-green3 hover:text-color60 text-center '
                          ><BsCartFill className='text-xl mt-0.5'/>  Shop Now!
                      </button>
                    </div>
                </div>
              </div>
              <div className='h-full w-1/2 '>
                  <div className='h-full w-full flex justify-center items-center'>
                    <video autoPlay loop muted plays-inline className='h-full w-11/12'>
                      <source src="./vids/Starpack_Trimmed.mp4"/>
                    </video>
                  </div>
              </div>
            </div>
        </div>

        {/* Page 2 */}
        <div ref={page2} class="snap-start bg-orange-200 w-screen h-screen ">
          <div className='h-1/10 p-10 w-full flex'/>
          <div className='flex h-9/10 w-screen'>
            <div>
              
            </div>
          </div>
        </div>

        {/* Page 3 */}
        <div ref={page3} class="snap-start bg-green-200 w-screen h-screen ">
          <div className='h-1/10 p-10 w-full flex'/>
          <div className='flex h-9/10 w-screen'>
            <div>
              
            </div>
          </div>
        </div>

        {/* Page 4 */}
        <div ref={page4} class="snap-start w-screen h-screen ">
          <div className='h-1/10 p-10 w-full '/>
          <div className='flex h-9/10 w-screen items-center'>
            <div className='w-7/12 flex flex-col justify-center items-center p-4 '>
              <div className='h-1/4 w-full flex '>
                <div className='w-1/2 h-full flex flex-col justify-center p-2'>
                  <h1 className='text-xl text-color60 font-semibold'>Step 1:</h1>
                  <p className='tracking-tight'>
                    Sign up for an Affiliate Program: Affiliates join a program offered by a company and receive a unique affiliate link.
                  </p>
                </div>
                <div className='w-1/2 h-full '>

                </div>
              </div>
              <div className='h-1/4 w-full flex'>
                <div className='w-1/2 h-full '>

                </div>
                <div className='w-1/2 h-full flex flex-col justify-center p-2 '>
                  <h1 className='text-xl text-color60 font-semibold'>Step 2:</h1>
                  <p>
                    Share the Affiliate Link: Affiliates share their special link through their website, social media, or other online channels.
                  </p>
                </div>
              </div>
              <div className='h-1/4 w-full flex'>
                <div className='w-1/2 h-full flex flex-col justify-center p-2 '>
                  <h1 className='text-xl text-color60 font-semibold'>Step 3:</h1>
                  <p>
                    People Click and Make Purchases: When someone clicks on the affiliate link and buys a product or service, 
                    the company tracks the sale back to the affiliate.
                  </p>
                </div>
                <div className='w-1/2 h-full '>
                  
                </div>
              </div>
              <div className='h-1/4 w-full flex'>
                <div className='w-1/2 h-full'>
      
                </div>
                <div className='w-1/2 h-full flex flex-col justify-center p-2 '>
                  <h1 className='text-xl text-color60 font-semibold'>Step 4:</h1>
                  <p>
                    Earn Commissions: Based on the program's terms, the affiliate receives a commission or a percentage 
                    of the sale as their reward for driving customers to the company.
                  </p>
                </div>
              </div>
            </div>
            <div className='flex flex-col h-9/10 w-5/12 justify-center items-start p-4 gap-5 border-l-2 border-yellow-500'>
              <h1 className='w-10/12 text-5xl text-color30 font-bold self-evenly '>Become an Affiliate</h1>
              <p className='w-10/12 text-md xl:text-xl text-black tracking-wide indent-3 ml-0.5'>
                  An affiliate is someone who helps sell or promote a product or service. 
                  They are like a partner to the company that makes the product. 
                  When the affiliate tells others about the product and those people buy it because of the affiliate's recommendation,
                  the affiliate gets a reward, like a small percentage of the money from the sale. 
                  It's a way for people to earn a little bit of money by sharing things they like with others.
              </p>
              <button 
                className='p-3 border-2 border-color30 hover:border-yellow-500 text-color30 hover:text-yellow-500 hover:bg-yellow-100 
                           ease-in-out duration-300 rounded-xl'
                >Register Now!
              </button>
            </div>
          </div>
        </div>

        {/* Page 5 */}
        <div ref={page5} class="snap-start bg-green-200 w-screen h-screen ">
          <div className='h-1/10 p-10 w-full flex'/>
          <div className='flex h-9/10 w-screen'>
            <div>
              
            </div>
          </div>
        </div>
    </div>
  )
}

export default HomePage