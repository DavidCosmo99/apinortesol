const express = require('express');
const router = express.Router();

const funcionarioController = require('../controllers/funcionarios-controllers');

router.post('/cadastro', funcionarioController.cadastrarFuncionario);
router.post('/login', funcionarioController.loginFuncionario);

module.exports = router;