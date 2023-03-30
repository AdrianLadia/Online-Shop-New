import Joi from 'joi';

class schemas {
    static userSchema() {
        return Joi.object({
            uid: Joi.string().required(),
            name: Joi.string(),
            email: Joi.string(),
            emailVerified: Joi.boolean(),
            phoneNumber: Joi.string().allow(''),
            deliveryAddress: Joi.array(),
            contactPerson: Joi.array(),
            isAnonymous: Joi.boolean(),
            orders: Joi.array(),
            cart: Joi.array(),
            favoriteItems: Joi.array(),
            payments: Joi.array(),
            userRole: Joi.string().required(),
          }).unknown(false)
    }

    static productSchema() {
        return Joi.object({
            itemId: Joi.string().required().invalid('',null),
            itemName: Joi.string().required().invalid('',null),
            unit: Joi.string().required().invalid('',null),
            price: Joi.number().required().invalid('',null,0),
            description: Joi.string().required().allow(''),
            weight: Joi.number().required().invalid('',null,0),
            dimensions: Joi.string().allow(''),
            category: Joi.string().required().invalid('',null),
            imageLinks: Joi.array(),
            brand: Joi.string().allow(''),
            pieces: Joi.number().required().invalid('',null,0),
            color: Joi.string().allow(''),
            material: Joi.string().allow(''),
            size: Joi.string().allow(''),
            stocksAvailable: Joi.number().required().invalid('',null),
            stocksOnHold: Joi.array().required(),
            averageSalesPerDay: Joi.number().required(),
            parentProductID: Joi.string().allow(''),
            stocksOnHoldCompleted: Joi.array().required(),
            forOnlineStore: Joi.boolean().required().invalid('',null),
            isCustomized: Joi.boolean().required().invalid('',null),
            salesPerMonth: Joi.array(),
            stocksIns: Joi.array(),
          }).unknown(false);
    }
}

export default schemas;