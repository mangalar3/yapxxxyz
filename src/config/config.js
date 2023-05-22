const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useNewUrlParser: true
})
.then(()=>console.log('Veritabanına bağlanıldı'))
.catch(hata => console.log(`Veritabanı bağlantı hatası ${hata}`));