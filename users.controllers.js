//desestructurar
const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarjwt');


const usuariosGet = async (req = request, res = response) => {
   // const {q, nombre = 'no name', apikey, page = 1, limit} =req.query;

    const {limite = 5, desde = 0} = req.query;

    const query = {estado: true};

    // const usuarios = await Usuario.find(query) //en el filtro puedo mandar el estado o lo que querramos
    // .skip(Number(desde))
    // .limit(Number(limite)); //lo casteamos para que al mandar el querry no reviente 

    // const total = await Usuario.countDocuments(query);

     //TODO: Esta funcion DE ARREGLOS DE PROMESAS es para que se ejecuten todas las promesas al mismo tiempo y sea menos la espera
     //pero si una falla, TODAS FALLAN
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query) //en el filtro puedo mandar el estado o lo que querramos
    .skip(Number(desde))
    .limit(Number(limite))
    ])

    res.json({
      
        total,
        usuarios
    });
  }

const usuarioPost = async (req, res = response) => { //req (lo que la persona solicita)
 
   

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Verificar si el correo existe 
    

    // encriptar la contraseña 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt); //para encriptarlo en una sola via

    //guardar en la base de datos

    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario._id);

    res.json({
        ok: true,
        usuario,
        token
        
    })

  }  

const usuarioPut = async (req, res = response) => {
    const {id} = req.params;
    const{_id, password, google, correo, ...resto} = req.body;

    //TODO: Validar contra la base de datos
    if (password) {
      //Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.json(
       
        usuario
    );
  }  

const usuarioDelete =  async (req, res = response) => {
     //destructurando el id
     const {id} = req.params;

     //const uid = req.uid;

    //borrar fisicamente
    //  const usuario = await Usuario.findByIdAndDelete(id); 
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    //
    
    //const usuarioAutenticado = req.usuario;

    

    res.json({usuario, });
  }  

const usuarioPatch =  (req, res = response) => {
    res.json({
        msg: 'patch API- controller'
    })
  }   

  module.exports = {
      usuariosGet,
      usuarioPost,
      usuarioPut,
      usuarioDelete,
      usuarioPatch
  }