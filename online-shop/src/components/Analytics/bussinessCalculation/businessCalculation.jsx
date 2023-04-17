class businessCalculation {
    constructor(){
    }

    getSimpleMovingAverage(salesData, number){
        let sum = 0;
        salesData && salesData.slice(-(number)).map((s)=>{
            sum += s.totalSalesPerMonth;
        })
        return sum / number;
    }

    getRateOfChange(salesData,period) {

        const p = (period + 1)
        try {
            const currentSalesData = salesData[salesData.length-1].totalSalesPerMonth
            const salesDataPeriodsAgo = salesData[salesData.length-p].totalSalesPerMonth
            let rateOfChangeEquation = ((currentSalesData - salesDataPeriodsAgo) / salesDataPeriodsAgo) * 100

            if (rateOfChangeEquation === Infinity) {
                return null
            }
            return rateOfChangeEquation
        }
        catch {
            return 0
        }
    }
}

export default businessCalculation