import firestoredb from '../src/components/firestoredb';
class dataValidation {
  constructor() {
    this.firestore = new firestoredb();
    this.error = false;
    this.messsage = '';
  }

  isString(string) {
    if (typeof string === 'string') {
      return true;
    } else {
      console.error('isString: ' + string + ' is not a string');
      this.error = true;
      this.messsage = 'isString: ' + string + ' is not a string';
      return false
    }
  }

  isNumber(number) {
    if (typeof number === 'number') {
      return true;
    } else {
      console.error('isNumber: ' + number + ' is not a number');
      this.error = true;
      this.messsage = 'isNumber: ' + number + ' is not a number';
      return false
    }
  }

  isDateObject(dateObject) {
    if (dateObject instanceof Date) {
      return true;
    } else {
      console.error('isDateObject: ' + dateObject + ' is not a date object');
      this.error = true;
      this.messsage = 'isDateObject: ' + dateObject + ' is not a date object';
      return false
    }
  }

  isArray(array) {
    if (Array.isArray(array)) {
        return true
    } else {
      console.error('isArray: ' + array + ' is not an array');
      this.error = true;
      this.messsage = 'isArray: ' + array + ' is not an array';
      return false
    }
  }

  isBoolean(bool) {
    if (typeof bool === 'boolean') {
        return true

    } else {
      console.error('isBoolean: ' + bool + ' is not a boolean');
      this.error = true;
      this.messsage = 'isBoolean: ' + bool + ' is not a boolean';
      return false
    }
  }

  isObject(object) {
    if (typeof object === 'object') {
        return true

    } else {
      console.error('isObject: ' + object + ' is not an object');
      this.error = true;
      this.messsage = 'isObject: ' + object + ' is not an object';
      return false
    }
  }
}

export default dataValidation;
