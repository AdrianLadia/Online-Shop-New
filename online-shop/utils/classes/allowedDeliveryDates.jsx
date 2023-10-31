import { ThirtyFpsOutlined } from '@mui/icons-material';

class allowedDeliveryDates {
  constructor(date = new Date()) {
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
    this.today = date;
    this.minDate = new Date();
    this.maxDate = new Date();
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
    this.getMinDate();
  }

  getMinDate = () => {
    const currentDate = this.today;
    const currentHour = currentDate.getHours();
    if (currentHour >= this.cutOffTime) {
      this.minDate.setDate(currentDate.getDate() + 1);
      this.isStoreOpen = false;
    } // 15 is the 24-hour representation of 3 PM
    else {
      this.minDate = currentDate;
      this.isStoreOpen = true;
    }

    // create a while loop and check if holiday if it is still a holiday add 1 day to minDate
    console.log(this.minDate);

    // function convertDateObjectToDateString(dateString) {
    //     const dateObj = new Date(dateString);
    //     const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-11 in JavaScript, so we add 1
    //     const day = String(dateObj.getDate()).padStart(2, '0');
    //     const year = dateObj.getFullYear();
    //     const formattedDate = `${month}/${day}/${year}`;
    //     return formattedDate;
    // }
    let foundMinDate
    while (foundMinDate != true) {
        console.log(this.minDate.toLocaleDateString())
        if (this.holidays.includes(this.minDate.toLocaleDateString())) {
            this.minDate.setDate(this.minDate.getDate() + 1);
        }
        else {
            foundMinDate = true
        }
    }
  };
}

export default allowedDeliveryDates;
