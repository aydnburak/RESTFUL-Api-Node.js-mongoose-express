const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const UserSchema = new Schema({
    isim: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength:50
    },
    userName: {
        type: String,
        required: [true,"username boş olamaz"],
        unique: true,
        trim: true,
        lowercase:true,
        minlength: [3,"username en az 3 karakter olmalı ...."],
        maxlength:50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
    },
    sifre: {
        type: String,
        required: true,
        minlength:6,
        trim:true
    },
    isAdmin: {
        type: Boolean,
        default : false
    }
}, { collection: 'kullanicilar', timestamps:true });

const schema = Joi.object({
    isim: Joi.string().min(3).max(50).trim(),
    userName: Joi.string().min(3).max(50).trim().messages({
        'string.base': 'username string olmalı',
        'string.empty': 'username boş olamaz!!',
        'string.min' : 'username en az 3 karakter olmalı !!!',
        'string.max' : 'username en fazla 50 karakter olmalı',
    }),
    email: Joi.string().trim().email().messages({
        'string.email' : 'yazdıgınız geçerli bir mail değil'
    }),
    sifre: Joi.string().min(6).trim(),
});

UserSchema.methods.generateToken = async function () {
    const girisYapanUser = this;
    const token = await jwt.sign({_id:girisYapanUser._id},'secretkey',{expiresIn : '3 days'});
    return token;

};

//yeni bir user için bu validation kullanılır
UserSchema.methods.joiValidation = function (userObject) { 
    schema.required();
    //console.log("BURADA", schema.validate(userObject));
    return schema.validate(userObject,{abortEarly:false});
}

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user._id;
    delete user.createdAt;    
    delete user.updatedAt;
    delete user.sifre;
    delete user.__v;

    return user;
       
}

UserSchema.statics.girisYap = async (email, sifre) => {

    const {error, value} = schema.validate({ email, sifre });

    if (error) {
        throw createError(400, error);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw createError(400, "Girilen email/şifre hatalı");
    }

    const sifreKontrol = await bcrypt.compare(sifre, user.sifre);

    if (!sifreKontrol) { 
        throw createError(400, "Girilen email/şifre hatalı");
    }

    return user;

}

//update için bu validation kullanılır
UserSchema.statics.joiValidationForUpdate = function (userObject) { 
    return schema.validate(userObject);
}

const User = mongoose.model('User', UserSchema);



module.exports = User;