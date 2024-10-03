const express = require('express');
const router = express.Router();
const {Login, createUser}  = require('../Controllers/ControllerAuthentication');
//Permite crear los endpoints con sus respectivos metodos

// Ruta para iniciar sesión
router.post('/login', Login);
router.post('/createUser', createUser);

module.exports = router;
