const dbValidators = require('./db-validators');
const generarJWT = require('./generarjwt');
const googleVerify = require('./google.verify');
const subirArchivo = require('./subir-archivos');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}