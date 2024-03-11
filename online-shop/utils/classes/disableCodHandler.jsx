import AppConfig from '../../src/AppConfig';

class disableCodHandler {
  constructor({ userdata, phoneNumber, email, itemsTotalPrice }) {
    this.userdata = userdata;
    this.phoneNumber = phoneNumber;
    this.email = email ? email.toLowerCase() : null;
    this.itemsTotalPrice = itemsTotalPrice;

    this.bannedPhoneNumbers = [
      { number: '+639178927202', reason: 'test' }, //do not delete because this is used for testing
      { number: '+639654000844', reason: 'Order on 10/25 was not received' },
      { number: '+639178519095', reason: 'Order on 03/11 was not received' },
    ];
    this.bannedEmails = [
      { email: 'test@gmail.com', reason: 'test' }, //do not delete because this is used for testing
      { email: 'kjanine.delfino28@gmail.com', reason: 'Order on 10/25 was not received' },
    ];

    this.maxPriceForCod = new AppConfig().getCashEnabledThreshold();

    // if one of these is true, user is banned from cod
    this.userIsCodBanned = null;
    this.phoneNumberIsCodBanned = null;
    this.emailIsCodBanned = null;
    this.aboveCodThreshold = null;

    // ______________________________________________

    this.isCodBanned = null;
    this.reason = null;
  }
  runMain() {
    this.checkIfUserIsBannedFromCod();
    this.checkIfPhoneNumberIsBannedFromCod();
    this.checkIfEmailIsBannedFromCod();
    this.checkIfPriceIsAboveCodLimit();
    this.getIsCodBanned();
  }

  test_addBannedPhoneNumber(bannedPhoneNumber) {
    this.bannedPhoneNumbers.push(bannedPhoneNumber);
  }

  test_addBannedEmail(bannedEmail) {
    this.bannedEmails.push(bannedEmail);
  }

  getIsCodBanned() {
    if (this.userIsCodBanned || this.phoneNumberIsCodBanned || this.emailIsCodBanned || this.aboveCodThreshold) {
      this.isCodBanned = true;
      return;
    } else {
      this.isCodBanned = false;
      return;
    }
  }

  checkIfUserIsBannedFromCod() {
    // we ban users that have used COD option before and ordered but did not receive the item,
    // we control this feature by using the key "cod_banned" in the user's profile

    if (this.userdata == undefined) {
      this.userIsCodBanned = false;
      return;
    }

    // if cod banned key does not exist false
    if (this.userdata['codBanned'] == undefined) {
      this.userIsCodBanned = false;
      return;
    }

    // if cod banned key exists and is false
    if (this.userdata['codBanned'].isBanned == false) {
      this.userIsCodBanned = false;

      return;
    }

    // if cod banned key exists and is true
    if (this.userdata['codBanned'].isBanned == true) {
      this.userIsCodBanned = true;
      this.reason = this.userdata['codBanned'].reason;
      return;
    }
  }

  checkIfPhoneNumberIsBannedFromCod() {
    // we ban users that have used COD option before and ordered but did not receive the item,
    // we control this feature by using the key "cod_banned" in the user's profile

    function convertPhoneNumberToInternationalFormat(phoneNumber) {
      if (phoneNumber.substring(0, 1) === '+') {
        return phoneNumber;
      }
      if (phoneNumber.substring(0, 1) === '0') {
        phoneNumber = phoneNumber.substring(1);
      }
      phoneNumber = '+63' + phoneNumber;
      return phoneNumber;
    }

    if (this.phoneNumber == undefined) {
      this.phoneNumberIsCodBanned = false;
      return;
    }

    this.phoneNumber = convertPhoneNumberToInternationalFormat(this.phoneNumber);

    const bannedNumbers = this.bannedPhoneNumbers.map((x) => x.number);
    if (bannedNumbers.includes(this.phoneNumber)) {
      this.phoneNumberIsCodBanned = true;
      this.reason = this.bannedPhoneNumbers.find((x) => x.number == this.phoneNumber).reason;
      return;
    } else {
      this.phoneNumberIsCodBanned = false;
      return;
    }
  }

  checkIfEmailIsBannedFromCod() {
    // we ban users that have used COD option before and ordered but did not receive the item,
    // we control this feature by using the key "cod_banned" in the user's profile

    if (this.email == undefined) {
      this.emailIsCodBanned = false;
      return;
    }

    const bannedEmails = this.bannedEmails.map((x) => x.email.toLowerCase());
    if (bannedEmails.includes(this.email)) {
      this.emailIsCodBanned = true;
      this.reason = this.bannedEmails.find((x) => x.email == this.email).reason;
      return;
    } else {
      this.emailIsCodBanned = false;
      return;
    }
  }

  checkIfPriceIsAboveCodLimit() {
    if (this.itemsTotalPrice == undefined) {
      this.aboveCodThreshold = false;
      return;
    }

    if (this.itemsTotalPrice > this.maxPriceForCod) {
      this.aboveCodThreshold = true;
      this.reason = `Total price is above ${this.maxPriceForCod} PHP`;
      return;
    } else {
      this.aboveCodThreshold = false;
    }
  }
}

export default disableCodHandler;
