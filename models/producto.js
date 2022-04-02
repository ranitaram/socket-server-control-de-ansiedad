const {Schema, model, SchemaTypes} = require('mongoose');

//Esquema para manejar la nueva collecion

const ProductoSchema = Schema({
   nombre: {
       type: String,
       required: [true, 'El nombre  es obligatorio'],
       unique: true
   },
   estado: {
       type: Boolean,
       default: true,
       required: true
   },
   usuario: {
       type: Schema.Types.ObjectId,
       ref: 'Usuario',
       required: true
   },
   precio: {
       type: Number,
       default: 0
   },
   categoria:{
       type: SchemaTypes.ObjectId,
       ref: 'Categoria',
       required: true
   },
   descripcion: {type: String},
   disponible: {type: Boolean, default: true},
   img: {type: String},

});

ProductoSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject(); //estoy sacando v y password y _id, todo lo demas se almacena en suario
    
    return data;
  }

module.exports = model('Producto', ProductoSchema);