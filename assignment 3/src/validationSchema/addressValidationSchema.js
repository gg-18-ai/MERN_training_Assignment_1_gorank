const joi = require("joi");

const addressValidationSchema = joi.object({
    type: joi.String().default("home").required(),
    street: joi.String().max(264).required(),
    type: joi.String().default("home").required(),
    type: joi.String().default("home").required(),
    type: joi.String().default("home").required(),
    type: joi.String().default("home").required(),
    type: joi.String().default("home").required(),
    type: joi.String().default("home").required(),
})