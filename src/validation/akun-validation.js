import Joi from "joi";

const registerAkunValidation = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).max(60).required(), 
    foto: Joi.string().allow(null, ''), // foto dapat berupa string atau null
    role: Joi.string().valid('USER', 'ADMIN', 'SUPERADMIN').required(), // pastikan peran adalah salah satu dari nilai yang valid
});

export {
    registerAkunValidation
}