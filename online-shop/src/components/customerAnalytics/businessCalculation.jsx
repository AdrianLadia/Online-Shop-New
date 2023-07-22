class businessCalculation {
    constructor(){
    }

    getAverageValueOfOrderBetween( data, chosenCustomer, start, end ){
        const startDate = new Date(start);
        const endDate = new Date(end);
        const customerData = Object.keys(data)
            .filter(customer => customer === chosenCustomer)
                .map(customer => {
                    return data[customer];
                });
        let totalValue = 0
        let count = 0
        customerData.map((info) => {
            Object.keys(info).map((date) => {
                const dataDate = new Date(date);
                if(startDate <= dataDate && dataDate <= endDate) {
                    Object.keys(info[date]).map((po) => {
                        totalValue += info[date][po]
                        count += 1
                    })
                }
            });
        });
        if(totalValue != 0){
            return ((totalValue / count).toFixed(2))
        }
    }

    getPurchaseFrequency( data, chosenCustomer, start, end ){
        const startDate = new Date(start);
        const endDate = new Date(end);
        const customerData = Object.keys(data)
            .filter(customer => customer === chosenCustomer)
                .map(customer => {
                    return data[customer];
                });
        let POcount = 0
        customerData.map((info) => {
            Object.keys(info).map((date) => {
                const dataDate = new Date(date);
                if(startDate <= dataDate && dataDate <= endDate) {
                    POcount += 1
                }
            });
        });
        if(POcount != 0){
            return (POcount + " purchase(s)")
        }
    }

    getAverageTimeBetweenPurchases( data, chosenCustomer, start, end ){
        const startDate = new Date(start);
        const endDate = new Date(end);
        const customerData = Object.keys(data)
            .filter(customer => customer === chosenCustomer)
                .map(customer => {
                    return data[customer];
                });
        const dates = []
        customerData.map((info) => {
            Object.keys(info).map((date) => {
                const dataDate = new Date(date);
                if(startDate <= dataDate && dataDate <= endDate) {
                    dates.push(dataDate)
                }
            });
        });
        dates.sort((a, b) => a - b);
        const numDates = dates.length;
        let totalInterval = 0;
      
        for (let i = 1; i < numDates; i++) {
          const interval = dates[i] - dates[i - 1];
          totalInterval += interval;
        }
      
        const averageIntervalInMilliseconds = totalInterval / (numDates - 1);
        const averageIntervalInDays = averageIntervalInMilliseconds / (1000 * 60 * 60 * 24);
        if(averageIntervalInDays > 0 ){
            return (averageIntervalInDays.toFixed(2) + " day(s)")
        }else{
            return "No Interval"
        }
    }

    getTotalValueOfOrder( data, chosenCustomer ){
        const customerData = Object.keys(data)
            .filter(customer => customer === chosenCustomer)
                .map(customer => {
                    return data[customer];
                });
        const purchases = []
        customerData.map((info) => {
            Object.keys(info).map((key) => {
                const date = key
                let totalValue = 0
                Object.keys(info[date]).map((po)=>{
                    totalValue += info[date][po]
                })
                purchases.push({ date:  date, total: totalValue })
            });
        });
        purchases.sort((a, b) => new Date(a.date) - new Date(b.date));
        return purchases
    }

}

export default businessCalculation