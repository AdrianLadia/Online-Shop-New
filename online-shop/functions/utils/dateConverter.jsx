class dateConverter {
    constructor() {
    }

    static convertDateTimeStampToDateString(timestamp) {
        let date
        if (timestamp._seconds === undefined) {
            date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        }
        if (timestamp.seconds === undefined) {
            date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate
    }

    static sortTimeStampArrayByDate(array) {
        array.sort((a, b) => {
            const timeA = a.orderDate.seconds * 1e9 + a.orderDate.nanoseconds;
            const timeB = b.orderDate.seconds * 1e9 + b.orderDate.nanoseconds;
            return timeA - timeB;
          });

        return array
    }
}

export default dateConverter