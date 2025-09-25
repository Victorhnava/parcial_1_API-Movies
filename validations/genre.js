const Joi = require('joi');

exports.genreValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(500),
    popularity: Joi.number().min(0),
    image: Joi.string().uri()
  });
  return schema.validate(data);
};