
const {response, request} = require('express');
const {Categoria} = require('../models');

//obtenerCategorias - paginado -populate
const obtenerCategoriasGet = async (req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query;

    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    });

}

//obtenerCategoria populate {} aqui solo me va a regresar un objeto de la categoria 
const obtenerCategoria = async (req, res = response)=>{
    const {id: _id} = req.params;
    const categoria =  await Categoria.findById(_id).populate('usuario', 'nombre');

    res.status(200).json({
        msg:"categoria encontrada",
        categoria
    });
}

//crear categoria
const crearCategoria = async(req, res = response)=>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //  Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    //preparar categoria para guardar
    const categoria = new Categoria(data);

    //Gaurdar DB
    await categoria.save();

    res.status(201).json(categoria);
}

//actualizarCategoria (solo va a recibir el nombre)
const actualizarCategoria = async (req, res = response)=> {
    const {id: _id} = req.params;
   // const categoria =  await Categoria.findById(_id).populate('usuario', 'nombre');
   const {estado, usuario, ...data} = req.body;

   data.nombre = data.nombre.toUpperCase();
   data.usuario = req.usuario._id;

   const categoria = await Categoria.findByIdAndUpdate(_id, data, {new: true});

   res.json({
       msg: 'todo un exito',
       categoria
   });
}

//borrar categoria -  que es solo cambiar el estado de la categria
const borrarCategoria = async (req, res = response) =>{
    const {id: _id} = req.params;
    // const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    const categoriaBorrada = await Categoria.findOneAndUpdate(_id,{estado: false}, {new:true})//para que se vea reflejada en la respuesta json);

    res.json({
        msg: 'Borrada',
       categoriaBorrada, });
}


module.exports = {
    crearCategoria,
    obtenerCategoriasGet,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}