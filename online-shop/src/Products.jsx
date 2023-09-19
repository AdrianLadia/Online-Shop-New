import React, { useEffect } from 'react';
import { useState } from 'react';
import { BsList, BsX } from 'react-icons/bs';


const Products = () => {
  const categories = [
    {
      categoryName: 'Paper Meal Box With Division',
      imagePath: ['2DIVTG', '3DIVTG', '4DIVTG'],
      description:
        "Crafted for convenience and sustainability, our 'Paper Meal Box With Division' is the ideal solution for portioned meals on the go. Made from high-quality, eco-friendly paper, this meal box features distinct compartments, ensuring that your food items remain separate and fresh. Its sturdy design and compact dimensions make it easy to transport, while the minimalist aesthetic suits a variety of settings. Whether you're packing a work lunch or serving at an event, this divided paper box ensures your meal is presented neatly and remains delectable until it's time to dig in.",
    },
    { categoryName: 'Aluminum Foil', imagePath: ['AFOIL (1)','AFOIL (2)','AFOIL (3)','AFOIL (4)','AFOIL (5)'], description: "" },
    { categoryName: 'Aluminum Tray', imagePath: ['ATRE2300JK', 'ATRE3100J', 'ATRE4300J', 'ATRE650J'], description: "Elevate your party serving game with our disposable food aluminum trays. Specifically designed for convenience and style, these trays are the perfect solution for serving a variety of dishes. Made from high-quality aluminum, they ensure even heat distribution, making them ideal for keeping your food warm and delectably delicious. Their lightweight construction allows for easy transport, and their sleek silver finish adds a touch of elegance to any party setting. Celebrate with ease and flair, knowing your culinary delights are presented in the best possible manner." },
    { categoryName: 'Cake Box', imagePath: [], description: "" },
    { categoryName: 'Chopsticks', imagePath: [], description: "" },
    { categoryName: 'Clamshell Box', imagePath: [], description: "" },
    { categoryName: 'Food Grade Cling Wrap', imagePath: [], description: "" },
    { categoryName: 'Plastic Spoon and Fork', imagePath: [], description: "" },
    { categoryName: 'Sauce Cups', imagePath: [], description: "" },
    { categoryName: 'Paper Plate', imagePath: [], description: "" },
    { categoryName: 'Takeaway Boxes', imagePath: [], description: "" },
    { categoryName: 'Paper Bowl', imagePath: [], description: "" },
    { categoryName: 'Paper Meal Box', imagePath: [], description: "" },
    { categoryName: 'Plastic Cups', imagePath: [], description: "" },
    { categoryName: 'Paper Cups', imagePath: [], description: "" },
    { categoryName: 'Plastic Gloves', imagePath: [], description: "" },
    { categoryName: 'Paper Bags', imagePath: [], description: "" },
    { categoryName: 'Roll Bags', imagePath: [], description: "" },
    { categoryName: 'Microwavable Containers', imagePath: [], description: "" },
    { categoryName: 'Sushi Tray', imagePath: [], description: "" },
    { categoryName: 'Trash Bag or Garbage Bag', imagePath: [], description: "" },
    { categoryName: 'Wax Paper', imagePath: [], description: "" },
  ];

  const [showMenu, setShowMenu] = useState(false);
  const [refs, setRefs] = useState({});
  const [scrolledUpOrDown, setScrolledUpOrDown] = useState(true);


  function openModal(itemId) {
    window.open(`https://starpack.ph/shop?modal=${itemId}`, '_blank');
  }

  function menuStyle() {
    if (showMenu == false) {
      return 'h-9 w-10 sm:h-14 sm:w-12 bg-transparent text-white hover:text-color60 mt-1 p-1 rounded-sm';
    } else {
      return 'h-12 w-10 sm:h-14 sm:w-12 bg-transparent text-white hover:text-red-300 mt-1 p-1 rounded-sm';
    }
  }

  function scroll(page) {
    refs[page].current.scrollIntoView({ behavior: 'auto' });
    setShowMenu(false);
    setTimeout(() => {
      setScrolledUpOrDown(false);
    }, 50);
  }

  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  function didScrollUpDown() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Check if scrolled up or down
    if (currentScrollTop !== lastScrollTop) {
      lastScrollTop = currentScrollTop;
      setScrolledUpOrDown(true);
    }

    return false;
  }

  window.addEventListener('scroll', () => {
    if (didScrollUpDown()) {
      console.log('Scrolled up or down!');
      // Do something else if needed
    }
  });

  useEffect(() => {
    if (scrolledUpOrDown == true) {
      setTimeout(() => {
        setScrolledUpOrDown(false);
      }, 4000);
    }
  }, [scrolledUpOrDown]);

  return (
    <div className='flex flex-col'>
      <div className=' h-16'></div>
      <div className='flex justify-center items-center mb-16 mt-10'>
        <h1 className='text-2xl font-bold lg:text-6xl text-color10b'>
          Starpack's product catalogue
        </h1>
      </div>
      {scrolledUpOrDown || showMenu ? (
        
        <nav className=" bg-color10c fixed top-0 left-0 w-screen z-10 ">
          <div className="justify-between  mx-5 py-5 flex flex-row h-20">
            <div className="rounded ">
              <img src="/favicon.ico" alt="logo" className="rounded-full h-12 w-12" />
            </div>
            <div className="block text-3xl">
              <div className="  flex justify-center items-center w-full h-full">
                {showMenu == false ? (
                  <BsList
                    className={menuStyle()}
                    onClick={() => {
                      setShowMenu(true);
                    }}
                  />
                ) : (
                  <BsX
                    className={menuStyle()}
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  />
                )}
              </div>
              {showMenu === true ? (
                <div className="absolute top-20 sm:top-20 right-4 w-3/5 xs:w-1/2 sm:w-1/3 ease-in-out duration-300">
                  <ul className=" h-96 shadow-inner-bottom  overflow-y-auto py-2 px-0.5 gap-2 divide-y  divide-green3 rounded-xl flex flex-col w-full justify-start items-center bg-green2 border border-green3">
                    {categories.map((category) => {
                      return (
                        <li>
                          <button
                            onClick={() => {
                              scroll(category.categoryName);
                            }}
                            className={'text-xl  '}
                          >
                            {category.categoryName}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
      ) : null}
      {categories.map((category) => {
        if (!refs[category.categoryName]) {
          setRefs((prevRefs) => ({
            ...prevRefs,
            [category.categoryName]: React.createRef(),
          }));
        }
        return (
          <section ref={refs[category.categoryName]} className="flex flex-col lg:flex-row h-screen ">
            <div className='flex flex-col justify-center items-center mt-10 lg:w-1/2 bg-red-300'>
              <h2 className='text-2xl font-bold text-color10a lg:text-4xl'>{category.categoryName}</h2>
              
              <div className="flex flex-row overflow-x-auto ml-5 mt-10  ">
                {category.imagePath.map((image) => {
                  
                  const withoutSpaces = image.replace(/\s/g, '');
                  const imageItemId = withoutSpaces.replace(/\(\d+\)/g, '');
                  return <img onClick={() => openModal(imageItemId)} key={image} className='w-4/5 h-4/5 hover:cursor-pointer' src={`/images/${image}.webp`} alt={image} />;
                })}
              </div>
            </div>
            <div className="flex h-full mt-5 px-5 lg:text-2xl text-black items-center justify-center lg:w-1/2">
              
                <p className='lg:mx-20'>{category.description}</p>
           
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Products;
