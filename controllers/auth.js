
//Controlador 
const {response, json} = require('express');
const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarjwt');
const { googleVerify } = require('../helpers/google.verify');
const { DefaultTransporter } = require('google-auth-library');
const usuario = require('../models/usuario');

const login = async (req, res = response) => {

   const {correo, password} = req.body;
   try {
       //Verificar si el Email existe
       const usuario = await Usuario.findOne({correo});
       if (!usuario) {
           return res.status(400).json({
                ok: false,
               msg: 'Usuario / Password no son correcrtos - correo'
           });
       }

       //si el usuario esta activo
       if (!usuario.estado) {
        return res.status(400).json({
            ok: false,
            msg: 'Usuario / Password no son correcrtos - estado: false'
        });
    }

       //Verificar la contraseña
       const valiPassword = bcryptjs.compareSync(password, usuario.password); //funcion para ver si hace match con la contraseña que ingresa el cliente
       if (!valiPassword) {
        return res.status(400).json({
            ok: false,
            msg: 'Usuario / Password no es correcrto - password'
        }); 
       }

       //Generar el JWT
       const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
        
    })
   } catch (error) {
       return res.status(500).json({
           msg: 'Hable con el administrador'
       })
   }   
}

const googleSingIn = async (req, res = response)=>{
  const {id_token} = req.body;

  try {

    const {nombre, img, correo} = await googleVerify(id_token);
    
    //Generar la autentificacion
    let usuario = await Usuario.findOne({correo});
    if (!usuario) {
        //Tengo que crearlo
        const data = {
           nombre,
           correo,
           rol: 'USER_ROLE',
           password: ':s',
           img,
           google: true
        };

        usuario = new Usuario(data);
        await usuario.save();
    }

    //Si el usuario en DB
    if (!usuario.estado) {
        return res.status(401).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
       usuario,
       token
    });
      
  } catch (error) {
      res.status(400).json({
          ok: false,
          msg: 'El token de google no es valido'
      })
  }

  
}

const renewToken =async (req, res = response ) => {
   const {usuario} =req;

   //Generar el jwt

    //  const usuario = await Usuario.findById(uid);
    const token = await generarJWT(usuario.id);
    
 res.json({
     ok: true,
     usuario,
     token
     
     
     
     
 })
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}