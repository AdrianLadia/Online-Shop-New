import Joi from 'joi';

class schemas {
  static employeeApplicationSchema() {
    return Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      gender: Joi.string().required(),
      age: Joi.date().required(),
      address: Joi.string().required(),
      CVorResume: Joi.string().required(),
    }).unknown(false);
  }
  static mayaSuccessRequestSchema() {
    return Joi.object({
      totalAmount: Joi.object({
        value: Joi.number().required(),
        currency: Joi.string().valid('PHP').required(),
      }).required(),
      buyer: Joi.object({
        contact: Joi.object({
          email: Joi.string().email().required(),
          phone: Joi.string().pattern(/^\d+$/),
        }).required(),
        shippingAddress: Joi.object({
          line1: Joi.string(),
          line2: Joi.string(),
          countryCode: Joi.string(),
        }).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
      }).required(),
      redirectUrl: Joi.object({
        success: Joi.string().uri().required(),
        failure: Joi.string().uri().required(),
        cancel: Joi.string().uri().required(),
      }).required(),
      requestReferenceNumber: Joi.string().required(),
      metadata: Joi.object({
        userId: Joi.string().required(),
      }).required(),
    }).unknown(false);
  }

  static userSchema() {
    return Joi.object({
      uid: Joi.string().required(),
      name: Joi.string().allow(null, ''),
      email: Joi.string().allow(null, ''),
      emailVerified: Joi.boolean(),
      phoneNumber: Joi.string().allow(null, ''),
      deliveryAddress: Joi.array(),
      contactPerson: Joi.array(),
      isAnonymous: Joi.boolean(),
      orders: Joi.array(),
      cart: Joi.object(),
      favoriteItems: Joi.array(),
      payments: Joi.array(),
      userRole: Joi.string().required(),
      affiliate: Joi.string().required().allow(null, ''),
      affiliateClaims: Joi.array().required(),
      affiliateDeposits: Joi.array().required(),
      affiliateCommissions: Joi.array().required(),
      bir2303Link: Joi.string().required().allow(null, ''),
      affiliateId: Joi.string().required().allow(null, ''),
      affiliateBankAccounts: Joi.array().required().allow(null, ''),
      joinedDate: Joi.date().required(),
      codBanned: Joi.object({
        isBanned: Joi.boolean().required(),
        reason: Joi.string().required().allow(null, ''),
      }),
      userPrices: Joi.object().required(),
      isAccountClaimed: Joi.boolean(),
    }).unknown(false);
  }

  static productSchema() {
    return Joi.object({
      itemId: Joi.string().required().invalid('', null),
      itemName: Joi.string().required().invalid('', null),
      unit: Joi.string().required().invalid('', null),
      price: Joi.number().required().invalid('', null, 0),
      description: Joi.string().required().allow(''),
      weight: Joi.number().required().invalid('', null, 0),
      dimensions: Joi.string().allow('', null),
      category: Joi.string().required().invalid('', null),
      imageLinks: Joi.array(),
      brand: Joi.string().allow('', null),
      pieces: Joi.number().required().invalid('', null, 0),
      color: Joi.string().allow('', null),
      material: Joi.string().allow('', null),
      size: Joi.string().allow('', null),
      stocksAvailable: Joi.number().required().invalid('').allow(null),
      stocksOnHold: Joi.array(),
      averageSalesPerDay: Joi.number().required().allow(null),
      parentProductID: Joi.string().allow('', null),
      stocksOnHoldCompleted: Joi.array(),
      forOnlineStore: Joi.boolean().invalid('', null),
      isCustomized: Joi.boolean().required().invalid('', null),
      salesPerMonth: Joi.array(),
      stocksIns: Joi.array().allow(null),
      clicks: Joi.array(),
      piecesPerPack: Joi.number().allow(null, ''),
      packsPerBox: Joi.number().allow(null, ''),
      cbm: Joi.number().allow('', null),
      manufactured: Joi.boolean(),
      machinesThatCanProduce: Joi.string().allow('', null),
      stocksLowestPoint: Joi.array(),
      boxImage: Joi.string().allow('', null),
      costPrice: Joi.number().allow('', null),
      freightCost: Joi.number().allow('', null, '?'),
      distributorPrice: Joi.number().allow('', null),
    }).unknown(false);
  }
}

export default schemas;
