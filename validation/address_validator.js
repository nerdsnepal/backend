const Joi = require('joi');

const addressSchema = Joi.object({
  fullName: Joi.string().required(),
  address1: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  label:Joi.string().default("Home"),
  landmark:Joi.string().allow(''),
  country: Joi.string().required(),
  phoneNumber: Joi.string()
  .pattern(/^[0-9]{6,14}$/)
  .required(),
});

module.exports = {
    validate:(data)=>{
        const { error, value } = addressSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};
