const Joi = require('joi');

exports.movieValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(200).required(),
    director: Joi.string().max(100).required(),
    releaseYear: Joi.number().min(1888).max(new Date().getFullYear() + 5).required(),
    genres: Joi.array().items(Joi.string()).min(1).required(),
    duration: Joi.number().min(1).required(),
    rating: Joi.number().min(0).max(10),
    description: Joi.string().max(1000),
    poster: Joi.string().uri(),
    budget: Joi.number().min(0),
    boxOffice: Joi.number().min(0),
    language: Joi.string().max(50),
    country: Joi.string().max(100),
    awards: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      year: Joi.number().min(1900).max(new Date().getFullYear())
    }))
  });
  return schema.validate(data);
};