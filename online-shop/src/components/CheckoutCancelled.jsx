import React from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutCancelled() {

  const navigateTo = useNavigate();

  function handleHome(){
    navigateTo("/shop");
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-md w-full md:w-96">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">Checkout Cancelled</h2>
          <p className="mt-4 text-gray-600">You have cancelled the checkout process.</p>
          <p className="mt-2 text-gray-600">If you need assistance or have any questions, please contact our support team.</p>
        </div>
        {/* <button className="mt-6 bg-yellow-500 text-white w-full py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50" onClick={() => window.location.reload()}>
          Return to Shop
        </button> */}
        <button className="mt-6 bg-yellow-500 text-white w-full py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50" onClick={handleHome}>
          Return to Shop
        </button>
      </div>
    </div>
  );
}

export default CheckoutCancelled;
