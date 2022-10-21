const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function( req, file, cb ){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
}
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ||
     file.mimetype === 'image/svg') {
        cb(null, true);
     } else {
        cb(null, false);
     }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const clienteController = require('../controllers/clientes-controllers');

router.get('/', clienteController.getClientes);
router.post('/', login.obrigatorio, upload.single('cliente_imagem') , clienteController.postClientes);
router.get('/:clt_id', clienteController.getUmCliente);
router.patch('/', clienteController.updateCliente);
router.delete('/', clienteController.deleteCliente);

module.exports = router;

