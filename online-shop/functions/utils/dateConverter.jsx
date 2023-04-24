class dateConverter {
    constructor() {
    }

    static convertDateTimeStampToDateString(seconds) {
        let date = new Date(seconds * 1000);
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }
}

export default dateConverter