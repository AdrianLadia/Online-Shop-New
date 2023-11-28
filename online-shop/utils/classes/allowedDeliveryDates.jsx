import { ThirtyFpsOutlined } from '@mui/icons-material';

class allowedDeliveryDates {
  constructor(dateToday = new Date()) {
    this.holidays = [
      '8/22/2023',
      '10/30/2023',
      '10/31/2023',
      '11/1/2023',
      '11/2/2023',
      '11/3/2023',
      '11/4/2023',
      '11/5/2023',
    ];
    this.daysAfterAllowed = 6;
    this.cutOffTime = 14;
    this.today = dateToday;
    this.minDate =  new Date(JSON.parse(JSON.stringify(dateToday)));
    this.maxDate = new Date(JSON.parse(JSON.stringify(dateToday)));
    this.maxDate.setDate(this.minDate.getDate() + this.daysAfterAllowed);
    this.isStoreOpen = null;
  }

  excludeDates = (date) => {
    if (this.holidays.includes(date.toLocaleDateString())) {
      return false;
    }
    return date.getDay() !== 0;
  };

  runMain() {
    this.getIsStoreOpen();
    this.getMinDate();
  }


  getIsStoreOpen() {
    const currentDate = this.today;
    const currentHour = currentDate.getHours();

    if (currentHour >= this.cutOffTime) {
      this.minDate.setDate(currentDate.getDate() + 1);
      this.isStoreOpen = false;
      return
    } // 15 is the 24-hour representation of 3 PM
    if (currentDate.getDay() === 0) {
      this.minDate.setDate(currentDate.getDate() + 1);
      this.isStoreOpen = false;
      return
    }
    else {
      this.minDate = new Date(currentDate.getTime())
      this.isStoreOpen = true;
      return
    }
  }

  getMinDate = () => {
  

    // We create a while loop to check if the minDate is a holiday
    // if it is a holiday, we add one day to the minDate
    // until we find a date that is not a holiday
    let foundMinDate
    while (foundMinDate != true) {
        console.log(this.minDate.toLocaleDateString())
        // if it is a holiday or a sunday
        if (this.holidays.includes(this.minDate.toLocaleDateString()) || this.minDate.getDay() === 0) {
            this.minDate.setDate(this.minDate.getDate() + 1);
        }
        else {
            foundMinDate = true
        }
    }
  };
}

export default allowedDeliveryDates;
