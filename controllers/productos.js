const {response, request} = require('express');
const { body } = require('express-validator');
const {Producto, Usuario, Categoria} = require('../models')

//Crear Producto
const crearProducto = async (req = request, res = response)=>{
   const {estado, usuario, ...body} = req.body;

   const nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }
    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id

        //Usuario,
        //Categoria
        
    }
    //preparar categoria a guardar
    const producto = new Producto(data);
    
    //Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

//obtenerProductos - paginado -populate
const obtenerProductosGet = async (req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query;

    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    });

}

//obtenerCategoria populate {} aqui solo me va a regresar un objeto de la categoria 
const obtenerProducto = async (req, res = response)=>{
    const {id: _id} = req.params;
    const producto =  await Producto.findById(_id).populate('usuario', 'nombre');

    res.status(200).json({
        msg:"producto encontrado",
        producto
    });
}

//actualizarProducto (solo va a recibir el nombre)
const actualizarProducto = async (req, res = response)=> {
    const {id: _id} = req.params;
   // const categoria =  await Categoria.findById(_id).populate('usuario', 'nombre');
   const {estado, usuario, ...data} = req.body;

   data.nombre = data.nombre.toUpperCase();
   data.usuario = req.usuario._id;

   const producto = await Producto.findByIdAndUpdate(_id, data, {new: true});

   res.json({
       msg: 'todo un exito',
       producto
   });
}

//borrar producto -  que es solo cambiar el estado de el producto
const borrarProducto = async (req, res = response) =>{
    const {id: _id} = req.params;
    // const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    const productoBorrado = await Producto.findOneAndUpdate(_id,{estado: false}, {new:true})//para que se vea reflejada en la respuesta json);

    res.json({
        msg: 'Borrado',
       productoBorrado, });
}

module.exports = {
    crearProducto,
    obtenerProductosGet,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}