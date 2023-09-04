import QRCode from 'react-qr-code';
import React from 'react';

const AffiliateForm = () => {

  const affiliateId = '123456';

  const url = window.location.href;
  // Create a URL object from the current URL
  const urlObject = new URL(url);

  // Get the base URL (protocol + hostname + port)
  const baseURL = urlObject.origin;

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mt-5">
        <QRCode value={baseURL + '/signUp?aid=' + affiliateId} />
      </div>
    </div>
  );
};

export default AffiliateForm;
