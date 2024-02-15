import React, { useEffect, useState, useContext } from 'react';
import LoginButton from './LoginButton';
import AppContext from '../AppContext';

const ClaimAccount = () => {
  const claimId = new URLSearchParams(window.location.search).get('claimId');
  const aid = new URLSearchParams(window.location.search).get('aid');
  const { setClaimAccountProcess,setClaimId,setAid } = useContext(AppContext);


  function claimAccount() {
    if (claimId && aid) {
      console.log('Claiming Account');
      setClaimAccountProcess(true);
      setClaimId(claimId);
      setAid(aid);
    } else {
      console.log('Invalid Claim');
    }
  }

  return (
    <div className="flex w-full justify-center">
      <button onClick={claimAccount} className="bg-color10b text-white p-3 rounded-lg">
        <LoginButton claimId={claimId} aid={aid} />
      </button>
    </div>
  );
};

export default ClaimAccount;
