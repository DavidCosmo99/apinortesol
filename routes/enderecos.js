const express = require('express');
const router = express.Router();

const enderecoController = require('../controllers/enderecos-controllers');

router.get('/', enderecoController.getEnderecos);
router.post('/', enderecoController.postEndereco);
router.get('/:end_codigo', enderecoController.getUmEndereco);
router.patch('/', enderecoController.updateEndereco);
router.delete('/', enderecoController.deleteEndereco);

module.exports = router;

