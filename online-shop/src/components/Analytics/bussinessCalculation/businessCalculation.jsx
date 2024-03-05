import InvalidDates from "../InvalidDates";

class businessCalculation {
    constructor(){
        this.invalidDates = new InvalidDates().getInvalidDates();
    }

    getSimpleMovingAverage(salesData, number){
        let sum = 0;
        salesData && salesData.slice(-(number)).map((s)=>{
            const date = new Date(s.year, s.month, 1);
            if (this.invalidDates.includes(date.getTime()) === false) {
                sum += s.totalSalesPerMonth;
            }
        })
        return sum / number;
    }

    getRateOfChange(salesData, period) {
        const p = (period + 1)
        try {
            console.log(salesData)
            const year = salesData[salesData.length-1].year;
            const month = salesData[salesData.length-1].month;
            if (this.invalidDates.some(date => date.year === year && date.month === month)) {
                return;
            }
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

    getClicks(clicks, period) {
        const average = clicks / period;
        return average;
    }
}

export default businessCalculation