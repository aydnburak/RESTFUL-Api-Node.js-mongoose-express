const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restful_api', {useCreateIndex:true, useUnifiedTopology: true, useFindAndModify:false,  useNewUrlParser: true})
    .then(() => console.log("veritabanına bağlanıldı"))
    .catch(hata => console.log("db baglantı hatası"));

 