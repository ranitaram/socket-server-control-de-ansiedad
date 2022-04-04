//const { Categoria } = require('../models');
const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');
// const {Usuario, Categoria }= require('../models');

const esRoleValido = async( rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado  en la base de datos`)
    }
  }
const emailExiste = async (correo = '') => {
    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
      throw new Error(`El correo: ${correo}, ya esta registrado`);
    }

}

const existeUsuarioPorId = async (id) => {
    //verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
      throw new Error(`El id no existe ${id}`);
    }

}

 const existeCategoria = async (id = '') => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
   const existeCategoriaPorId = await Categoria.findById(id);
   if (!existeCategoriaPorId) {
     throw new Error(`El id no existe${id}`);
   }
  }
 }
 
 const existeProducto = async (id = '') => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
   const existeProductoPorId = await Producto.findById(id);
   if (!existeProductoPorId) {
     throw new Error(`El id del producto no existe${id}`);
   }
  }
 } 

 //validar colecciones permitidas
 const coleccionesPermitidas = (coleccion = '', colecciones = [])=>{
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
      throw new Error(`La colección ${coleccion} no es permitida, solo estos: ${colecciones}`);
    }
    return true;
 }
  

  module.exports = {
      esRoleValido,
      emailExiste,
      existeUsuarioPorId,
      existeCategoria,
      existeProducto,
      coleccionesPermitidas
  }