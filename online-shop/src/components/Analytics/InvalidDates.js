class InvalidDates {
  constructor() {
    this.invalidDates = [{ month: 2, year: 2024 }]
  }

  getInvalidDates() {
    const invalidDatesList = [];
    this.invalidDates.forEach((date) => {
      const month = date.month;
      const year = date.year;
      const d = new Date(year, month, 1);
      invalidDatesList.push(d.getTime());
    });
    return invalidDatesList;
  }
}

export default InvalidDates;
