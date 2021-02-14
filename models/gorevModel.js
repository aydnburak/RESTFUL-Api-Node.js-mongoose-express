const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');
const createError = require('http-errors');

const GorevSchema = new Schema({
    tanim: {
        type: String,
        trim: true,
        required: true,
    },
    tamamlandi: {
        type: Boolean,
        default : false
    },
    sahip: {
        type: Schema.Types.ObjectId,
        required: true,
        ref : 'User'
    }
}, {collection :'gorevler', timestamps:true});

const schema = Joi.object({
    tanim: Joi.string().trim().messages({
        'string.base': 'tanım string olmalı',
        'string.empty': 'tanım boş olamaz!!',
    }),
});

GorevSchema.methods.joiValidation = function (gorevObject) {
    schema.required();
    return schema.validate(gorevObject, { abortEarly: false });
}

GorevSchema.statics.joiValidationForUpdate = function (gorevObject) {
    return schema.validate(gorevObject, { abortEarly: false });
}

const Gorev = mongoose.model('Gorev', GorevSchema);

module.exports = Gorev;