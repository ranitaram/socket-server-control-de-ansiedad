const {Router} = require('express');
const { check } = require('express-validator');
const { 
    crearCategoria,
    obtenerCategoriasGet, 
    obtenerCategoria, 
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');

const router = Router();

//url/api/categorias/

//obtener todas las catgorias - publico
router.get('/', obtenerCategoriasGet);

//obtener una catgoria por id - publico

//TODO: Hacer un middleware personalizador que va a validar el Id en la ruta
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
   validarCampos
], obtenerCategoria);

//Crear categoria - privado - cualquierpersona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos 
    ], crearCategoria);  

//actualizar -privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],actualizarCategoria);  

//borrar una cetegoria - solo administrador
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    //tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
    check('id').custom(existeCategoria),
    validarCampos
],borrarCategoria);  

module.exports = router;