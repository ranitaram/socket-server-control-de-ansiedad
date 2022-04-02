const {Router} = require('express');
const { check } = require('express-validator');
const { login, googleSingIn, renewToken } = require('../controllers/auth');
const { validarJWT, revalidarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login  );  //definimos la ruta post al login

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
       validarCampos
],googleSingIn );

router.get('/renew', validarJWT, renewToken)

module.exports = router;