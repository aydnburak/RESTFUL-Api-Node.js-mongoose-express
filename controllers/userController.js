const User = require('../models/userModel');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const tumUserlariListele = async (req, res) => {
   
    const tumUserlar = await User.find({});
    res.json(tumUserlar);
};

const oturumAcanKullaniciBilgileri = (req,res,next) => {
    res.json(req.user);
}

const oturumAcanKullaniciGuncelleme = async (req,res,next) => {
    delete req.body.createdAt;
    delete req.body.updatedAt;

    if (req.body.hasOwnProperty('sifre')) {
        req.body.sifre = await bcrypt.hash(req.body.sifre, 10);
    }

    const { error, value } = User.joiValidationForUpdate(req.body);
    if (error) {
        next(createError(400, error));
    } else {
        try {
            const sonuc = await User.findByIdAndUpdate({ _id: req.user._id}, req.body, { new: true, runValidators:true });
            if (sonuc) {
                return res.json(sonuc);
            } else {
                return res.status(404).json({
                    mesaj: "Kullanıcı bulunamadı",
                });
            }
        } catch (e) {
            next(e);
        }
    }
  
}


const yeniKullaniciOlustur = async (req, res,next) => {

    try {
       
        const eklenecekUser = new User(req.body);
       
        if(req.body.sifre && req.body.sifre.length >= 6)
        eklenecekUser.sifre = await bcrypt.hash(eklenecekUser.sifre, 10);
      
        const { error, value } = eklenecekUser.joiValidation(req.body);
        

        if (error) { 
            console.log("Joi error\n\n", error);
            
            next(createError(400, error));
        
        } else {
            try {
                const sonuc = await eklenecekUser.save();
                res.json(sonuc);
            } catch (err) {
                throw err;
            }
           
           
        }

        
    } catch (err) { 
        next(err);
    }
    
}

const girisYap = async (req, res, next) => {

    try {
        
        const user = await User.girisYap(req.body.email, req.body.sifre);
        const token = await user.generateToken();
        res.json({
            user,
            token
        });


    } catch (hata) {
        next(hata);
    }

}

const adminUserGuncelleme = async (req,res,next) => {
   
    delete req.body.createdAt;
    delete req.body.updatedAt;

    if (req.body.hasOwnProperty('sifre')) {
        req.body.sifre = await bcrypt.hash(req.body.sifre, 10);
    }

    const { error, value } = User.joiValidationForUpdate(req.body);
    if (error) {
        next(createError(400, error));
    } else {
        try {
            const sonuc = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators:true });
            if (sonuc) {
                return res.json(sonuc);
            } else {
                return res.status(404).json({
                    mesaj: "Kullanıcı bulunamadı",
                });
            }
        } catch (e) {
            next(e);
        }
    }
  
   
    
}

const tumKullanicilariSil = async (req,res, next) => {
    
    try {
        const sonuc = await User.deleteMany({isAdmin : false});
        if (sonuc) {
            return res.json({
                mesaj:"Tüm kullanıcılar silindi",
            });
        } else { 
            throw createError(404, 'Kullanıcı bulunamadı');
           
        }
    } catch (e) {
        console.log(e);
        
       next(createError(400, e));
    
    }

}

const kullaniciKendiniSil = async (req,res, next) => {
    
    try {
        const sonuc = await User.findByIdAndDelete({ _id: req.user._id });
        if (sonuc) {
            return res.json({
                mesaj:"Kullanıcı silindi",
            });
        } else { 
            throw createError(404, 'Kullanıcı bulunamadı');
           
        }
    } catch (e) {
        

       next(createError(400, e));
    
    }

}

const yoneticiKullaniciSil = async (req,res, next) => {
    
    try {
        const sonuc = await User.findByIdAndDelete({ _id: req.params.id });
        if (sonuc) {
            return res.json({
                mesaj:"Kullanıcı silindi",
            });
        } else { 
            throw createError(404, 'Kullanıcı bulunamadı');
        
        }
    } catch (e) {
        

       next(createError(400, e));
    
    }

}
    



module.exports = {
    tumUserlariListele,
    oturumAcanKullaniciBilgileri,
    oturumAcanKullaniciGuncelleme,
    yeniKullaniciOlustur,
    girisYap,
    adminUserGuncelleme,
    tumKullanicilariSil,
    kullaniciKendiniSil,
    yoneticiKullaniciSil
}