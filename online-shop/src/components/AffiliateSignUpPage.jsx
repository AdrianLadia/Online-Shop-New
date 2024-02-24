import React, { useEffect,startTransition } from 'react'
import AppContext from '../AppContext';
import { useNavigate } from 'react-router-dom';
import HomePage from '../HomePage';

const AffiliateSignUpPage = () => {
    const { userdata } = React.useContext(AppContext);
    const navigateTo = useNavigate();

    useEffect(() => {
        if (userdata != null) {
          startTransition(() => navigateTo('/shop'))
        }
    }, [userdata]);

  return (
    <div>
        <HomePage isAffiliateLink={true}/>
    </div>
  )
}

export default AffiliateSignUpPage
