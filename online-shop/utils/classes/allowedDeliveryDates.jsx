class allowedDeliveryDates {
  constructor(date = new Date()) {
    this.holidays = [
        "8/22/2023",
    ]
    this.daysAfterAllowed = 6
    this.cutOffTime = 14
    this.today = date;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.minDate.getDate() + this.daysAfterAllowed);
    this.isStoreOpen = null
}
  
    excludeDates = (date) => {
        if (this.holidays.includes(date.toLocaleDateString())) {
            return false;

        }
        return date.getDay() !== 0 
    }

    runMain() {
        this.getMinDate();
    }

    getMinDate = () => {
        const currentDate = this.today
        const currentHour = currentDate.getHours();
        if (currentHour >= this.cutOffTime) {
            this.minDate.setDate(currentDate.getDate() + 1);
            this.isStoreOpen = false
        } // 15 is the 24-hour representation of 3 PM
        else {
            this.minDate = currentDate;
            this.isStoreOpen = true
        }
    }
 
}

export default allowedDeliveryDates