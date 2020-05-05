const joi = require('@hapi/joi');

const schema = {
    user: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        first_name: joi.string().max(100).required(),
        last_name: joi.string().max(100).required(),
        state: joi.string().max(30).required()
    }),
    login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    }),
    parcel: joi.object({
        user_id: joi.number(),
        price: joi.number(),
        weight: joi.string().required(),
        location: joi.string().required(),
        destination: joi.string().required(),
        sender_name: joi.string().required(),
        sender_note: joi.string()
    }),
    
}

module.exports = schema