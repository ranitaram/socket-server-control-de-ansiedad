

const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const revalidarJWT = async (req = request, res = response, next) => {
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
      req.body = uid


       next();
   } catch (error) {
       console.log(error);
       res.status(401).json({
        msg: 'Token no válido'
   })

   
}


}
module.exports = {
    revalidarJWT
}