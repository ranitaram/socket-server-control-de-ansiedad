const validarCampos = require('../middlewares/validar-campos');
const  validarJWT  = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarArchivoSubir = require('../middlewares/validar-archivo');
const revalidarJWT = require('../middlewares/revalidar-jwt');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivoSubir,
    ...revalidarJWT
}