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
}

export default schemas;