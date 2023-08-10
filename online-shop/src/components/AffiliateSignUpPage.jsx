import React, { useEffect } from 'react'
import AppContext from '../AppContext';
import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';
import HomePage from '../HomePage';

const AffiliateSignUpPage = (props) => {
    const { userdata } = React.useContext(AppContext);
    const navigateTo = useNavigate();

    useEffect(() => {
        if (userdata != null) {
            navigateTo('/shop')
        }
    }, [userdata]);

  return (
    <div>
        <HomePage isAffiliateLink={true}/>
    </div>
  )
}

export default AffiliateSignUpPage
