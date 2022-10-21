const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaClientes = require('./routes/clientes');
const rotaEnderecos = require('./routes/enderecos');
const rotaFuncionarios = require('./routes/funcionarios');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE, GET, POST');
            return res.status(200).send({});
        }

        next();
});

app.use('/clientes', rotaClientes);
app.use('/enderecos', rotaEnderecos);
app.use('/funcionarios', rotaFuncionarios);

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app;