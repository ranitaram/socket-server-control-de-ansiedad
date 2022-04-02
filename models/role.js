const {Schema, model} = require('mongoose');

//Esquema para manejar la nueva collecion

const RoleSchema = Schema({
   rol: {
       type: String,
       required: [true, 'El rol no es obligatorio']
   }
});

module.exports = model('Role', RoleSchema);