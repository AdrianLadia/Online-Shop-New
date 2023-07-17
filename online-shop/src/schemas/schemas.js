import Joi from 'joi';

class schemas {
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
      phoneNumber: Joi.string().allow(null,''),
      deliveryAddress: Joi.array(),
      contactPerson: Joi.array(),
      isAnonymous: Joi.boolean(),
      orders: Joi.array(),
      cart: Joi.object(),
      favoriteItems: Joi.array(),
      payments: Joi.array(),
      userRole: Joi.string().required()
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
      dimensions: Joi.string().allow(''),
      category: Joi.string().required().invalid('', null),
      imageLinks: Joi.array(),
      brand: Joi.string().allow('',null),
      pieces: Joi.number().required().invalid('', null, 0),
      color: Joi.string().allow('',null),
      material: Joi.string().allow('',null),
      size: Joi.string().allow('',null),
      stocksAvailable: Joi.number().required().invalid('').allow(null),
      stocksOnHold: Joi.array().required().allow(null),
      averageSalesPerDay: Joi.number().required().allow(null),
      parentProductID: Joi.string().allow('',null),
      stocksOnHoldCompleted: Joi.array().required().allow(null),
      forOnlineStore: Joi.boolean().required().invalid('', null),
      isCustomized: Joi.boolean().required().invalid('', null),
      salesPerMonth: Joi.array(),
      stocksIns: Joi.array().allow(null),
      clicks: Joi.array(),
      piecesPerPack: Joi.number().allow(null,''),
      packsPerBox: Joi.number().allow(null,''),
      cbm: Joi.number().allow('',null),
      manufactured: Joi.boolean().required(),
      machinesThatCanProduce: Joi.string().allow('',null),
      stocksLowestPoint: Joi.array(),
      boxImage: Joi.string().allow('',null),
      costPrice: Joi.number().allow('',null),
    }).unknown(false);
  }
}

export default schemas;
