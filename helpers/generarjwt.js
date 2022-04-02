const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
    //el jwt tiene que trabajar en bases a promesas
    return new Promise((resolve, reject)=> {
       //Generar el jwt
       const payload = {uid}; // aqui voy a guardar el uid

       jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
           expiresIn: '12h'
       },(err, token)=> {
           if (err) {
               console.log(err);
               reject('No se pudo generar el token')
           } else {
               resolve(token);
           }
       }
        )
    })

}

module.exports = {
    generarJWT
}