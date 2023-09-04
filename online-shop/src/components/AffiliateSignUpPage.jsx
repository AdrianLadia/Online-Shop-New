import React, { useEffect } from 'react'
import AppContext from '../AppContext';
import { useNavigate } from 'react-router-dom';
import HomePage from '../HomePage';

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
        <HomePage isAffiliateLink={true}/>
    </div>
  )
}

export default AffiliateSignUpPage
