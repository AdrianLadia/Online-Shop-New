class allowedDeliveryDates {
  constructor() {
    this.holidays = [
        "8/22/2023",
    ]
    this.daysAfterAllowed = 6
    this.cutOffTime = 12
    this.today = new Date();
    this.minDate = new Date();
    this.maxDate = new Date(this.minDate);
    this.maxDate.setDate(this.minDate.getDate() + this.daysAfterAllowed);
}
  
    excludeDates = (date) => {
        if (this.holidays.includes(date.toLocaleDateString())) {
            console.log('date is excluded', date)
            return false;

        }
        return date.getDay() !== 0 
    }

    runMain() {
        this.getMinDate();
    }

    getMinDate = () => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        if (currentHour >= this.cutOffTime) {
            this.minDate.setDate(currentDate.getDate() + 1);
        } // 15 is the 24-hour representation of 3 PM
        else {
            this.minDate = currentDate;
        }
    }
 
}

export default allowedDeliveryDates