import Joi from "joi";

export default function isValidPhilippinePhoneNumber(phoneNumber) {
    // This regex checks for:
    // 1. Mobile numbers that start with 09 and followed by 9 digits
    // 2. Landline numbers that might start with an area code in parentheses and then followed by 6-8 digits
    const regexPattern = /^((\+63)|0)9\d{9}$|^\(0\d{2}\)\s?\d{6,8}$/;

    const schema = Joi.string().pattern(regexPattern);
    const { error } = schema.validate(phoneNumber);

    if (error) {
      return false;
    }

    return true;
  }