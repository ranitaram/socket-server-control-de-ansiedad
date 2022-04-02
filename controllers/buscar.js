const {response} = require('express');
const {ObjectId} = require('mongoose').Types;

const {Usuario, Categoria, Producto} = require('../models');

const coleccionesPermitidas = [

    'usuarios',
    'categoria',
    'productos',
    'roles',
];

const buscarUsuarios = async (termino, res = response) => {
    const esMongoID = ObjectId.isValid(termino); // true

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
     //SISTEMA DE BUSQUEDAS
    //expresion regular, que sea insensibles a las mayusculas y minisculas y más flexible
    const regex = new RegExp(termino, 'i');
    

    const usuarios = await Usuario.find({
        $or:[{nombre: regex}, {coreo: regex}],// tiene que cumplir con el nombre o el correo
        $and:[{estado: true}] //para que solo me mande los que estan activos (los eliminados no)
    }); //si el nombre es igual al termino

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // true

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
     //SISTEMA DE BUSQUEDAS
    //expresion regular, que sea insensibles a las mayusculas y minisculas y más flexible
    const regex = new RegExp(termino, 'i');
    

    const categorias = await Categoria.find({
       nombre: regex, estado: true
    }); //si el nombre es igual al termino

    res.json({
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // true

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
     //SISTEMA DE BUSQUEDAS
    //expresion regular, que sea insensibles a las mayusculas y minisculas y más flexible
    const regex = new RegExp(termino, 'i');
    

    const productos = await Producto.find({
       nombre: regex, estado: true
    })
    .populate('categoria','nombre'); //si el nombre es igual al termino

    res.json({
        results: productos
    });
}

const buscar = (req, res = response) => {

    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

   switch (coleccion) {
       case 'usuarios':
           buscarUsuarios(termino,res);
           
           break;
        case 'categoria':
            buscarCategorias(termino,res);
           
            break;
        case 'productos':
            buscarProductos(termino, res);
           
                break;    
   
       default:
           res.status(500).json({
               msg: 'Se me olvido hacer esta busqueda'
           })
          
   }
}

module.exports = {
    buscar
}