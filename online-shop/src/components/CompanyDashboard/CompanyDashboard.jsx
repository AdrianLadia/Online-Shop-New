import React, { useEffect,useContext,useState } from 'react'
import AppContext from '../../AppContext'

const CompanyDashboard = () => {

    const { firestore, allUserData ,setAllUserData ,categories } = useContext(AppContext);
    const [overallTotalSalesValue, setOverallTotalSalesValue] = useState(0);

    useEffect(() => {
        firestore.readSelectedDataFromCollection('Analytics','overallTotalSalesValue').then((data) => {
            console.log(data.data);
            setOverallTotalSalesValue(data.data);
        });
    }, []);

  return (
    <div>
      test
    </div>
  )
}

export default CompanyDashboard
