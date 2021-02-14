const Gorev = require('../models/gorevModel');
const createError = require('http-errors');


const tumGorevleriListele = async (req, res, next) => {
    const oturumAcanUserID = req.user._id;
    try {
        const tumGorevlerim = await Gorev.find();
        return res.json(tumGorevlerim);
    } catch (err) {
        next(err);
    }
}

const gorevGoster = async (req, res, next) => {
    const oturumAcanUserID = req.user._id;
    try {
        const gorevim = await Gorev.find({sahip:oturumAcanUserID, _id : req.params.id });
        return res.json(gorevim);
    } catch (err) {
        next(err);
    }
}

const gorevSil = async (req, res, next) => {
    const oturumAcanUserID = req.user._id;
    try {
        const gorevim = await Gorev.findByIdAndDelete({_id : req.params.id, sahip : oturumAcanUserID});
        return res.json({
            mesaj : "Görev silindi",
        });
    } catch (err) {
        next(err);
    }
}

const gorevGuncelle = async (req, res, next) => {
    const oturumAcanUserID = req.user._id;
    const guncellenenGorevID = req.params.id;

    delete req.body.createdAt;
    delete req.body.updatedAt;

    const { error, value } = Gorev.joiValidationForUpdate(req.body);
    if (error) {
        next(createError(400, error));
    } else {
        try {
            const sonuc = await Gorev.findByIdAndUpdate({ _id: guncellenenGorevID, sahip: oturumAcanUserID }, req.body, {
                new:true, runValidators:true
            });
            if (sonuc) {
                return res.json(sonuc);
            } else {
                return res.status(404).json({
                    mesaj : "Görev bulunamadı ve güncellenemedi"
                });
            }
        } catch (err) {
            next(err);
        }
    }

    
}

const tumGorevlerimiListele = async (req, res, next) => {
    const oturumAcanUserID = req.user._id;
    try {
        const tumGorevlerim = await Gorev.find({ sahip: oturumAcanUserID });
        
        for (gorev of tumGorevlerim) {
             await gorev.populate('sahip').execPopulate();
        }
        
        
        return res.json(tumGorevlerim);
    } catch (err) {
        next(err);
    }
}

const gorevEkle = async (req, res, next) => {
    const oturumAcanUserID = req.user._id;
    try {
       
        const eklenecekGorev = new Gorev({
            ...req.body,
            sahip : oturumAcanUserID,
        });
        const {error, value} = eklenecekGorev.joiValidation(req.body);

        if (error) {
            next(createError(400, error));
        } else {
            const sonuc = await eklenecekGorev.save();
            return res.json(sonuc);
        }
      
    } catch (e) {
        next(e);
    }
}

module.exports = {
    tumGorevlerimiListele,
    gorevEkle,
    tumGorevleriListele,
    gorevGoster,
    gorevSil,
    gorevGuncelle
}