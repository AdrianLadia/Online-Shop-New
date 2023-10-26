import AppConfig from "../../src/AppConfig";

class disableCodHandler {
    constructor({userdata,phoneNumber,email,itemsTotalPrice}) {
        this.userdata = userdata;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.itemsTotalPrice = itemsTotalPrice;

        this.bannedPhoneNumbers = [
            '+639178927206'
        ]
        this.bannedEmails = [
            'test@gmail.com'
        ]

        this.maxPriceForCod = new AppConfig().getCashEnabledThreshold()

        // if one of these is true, user is banned from cod
        this.userIsCodBanned = null;
        this.phoneNumberIsCodBanned = null;
        this.emailIsCodBanned = null;
        this.aboveCodThreshold = null;

        // ______________________________________________

        this.isCodBanned = null
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
        }
        else {
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
        if (this.userdata['codBanned'] == false) {
            this.userIsCodBanned = false;
            return;
        }

        // if cod banned key exists and is true
        if (this.userdata['codBanned'] == true) {
            this.userIsCodBanned = true;
            return;
        }
    }

    checkIfPhoneNumberIsBannedFromCod() {
        // we ban users that have used COD option before and ordered but did not receive the item,
        // we control this feature by using the key "cod_banned" in the user's profile

        if (this.phoneNumber == undefined) {
            this.phoneNumberIsCodBanned = false;
            return;
        }


        if (this.bannedPhoneNumbers.includes(this.phoneNumber)) {
            this.phoneNumberIsCodBanned = true;
            return;
        }
        else {
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


        if (this.bannedEmails.includes(this.email)) {
            this.emailIsCodBanned = true;
            return;
        }
        else {
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
            return 
        }
        else {
            this.aboveCodThreshold = false;
        }
    }
}

export default disableCodHandler;