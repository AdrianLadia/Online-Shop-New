import React, { useEffect } from 'react'
import AppContext from '../AppContext';
import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';

const AffiliateSignUpPage = (props) => {
    const setAffiliate = props.setAffiliate
    let params = new URLSearchParams(window.location.search);
    let affiliateId = params.get('aid');
    const { userdata } = React.useContext(AppContext);
    const navigateTo = useNavigate();

    useEffect(() => {
        setAffiliate(affiliateId);
    }, [affiliateId]);


    useEffect(() => {
        if (userdata != null) {
            navigateTo('/shop')
        }
    }, [userdata]);

  return (
    <div>
        {affiliateId}
        <LoginButton />
    </div>
  )
}

export default AffiliateSignUpPage