const Joi = require("joi");

const staffSchema = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required(),
    image: Joi.string().required(),
});

module.exports = {
    staffSchema,
};
