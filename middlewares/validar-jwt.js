

const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
  //LEER EL TOKEN
   const token = req.header('x-token');
   if (!token) {
       return res.status(401).json({
           msg: 'No hay token en la peticion'
       });
   }
   try {
     const {uid} =  jwt.verify(token, process.env.SECRETORPRIVATEKEY);   
     //leer el usuario que corresponde al uid
     const usuario = await Usuario.findById(uid); //con esto leemos el usuario
    
     if (!usuario) {
        return res.status(401).json({
            msg: 'Token no valido- usuario no existe en DB'
        })
     }

     //Verificar si el uid tiene estado en true
     if (!usuario.estado) {
         return res.status(401).json({
             msg: 'Token no valido- usuario con estado: false'
         })
     }
     
     
     req.usuario = usuario; //recordar que todo pasa por argumento, asi que hay que tener cuidado de no sobreescribir
     //req.uid = uid;



       next();
   } catch (error) {
       console.log(error);
       res.status(401).json({
        msg: 'Token no válido'
   })

   
}


}
module.exports = {
    validarJWT
}