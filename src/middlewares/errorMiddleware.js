
const hataYakalayici = (err, req, res, next) => {
   if(err.name === 'CastError'){
         res.json({
             mesaj: 'Geçerli bir id giriniz',
         });
     }else{
         res.status(err.hataKodu).json({
             mesaj: err.message,
             hataKodu: err.hataKodu,
         });
     } 


if(err.code === 11000){
   return res.json({
        mesaj: Object.keys(err.keyValue) + " için girdiğiniz "+ Object.values(err.keyValue)+" daha önceden veri tabanında olduğu için tekrar eklenemez & güncellenemez! Değerler unique olmalıdır.",
        hataKodu: 400
    })
}
if(err.code === 66){
    return res.json({
        mesaj: "Değiştirilemez bir alanı güncellemeye çalıştınız",
        hataKodu: 11
    })
}


    res.status(err.statusCode || 500);
    res.json({
        hataKodu: err.statusCode || 500,
        mesaj: err.message,
    })

};

module.exports = hataYakalayici;