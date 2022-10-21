const mysql = require('../mysql').pool;

exports.getClientes = (req,res,next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })}
        conn.query(
            'SELECT * FROM tb_cliente',
            (error, result, field) => {
                if (error) { return res.status(500).send({ error:error })}

                const response = {
                    quantidade: result.length,
                    clientes: result.map(clt => {
                        return {
                            id: clt.clt_codigo,
                            nome: clt.clt_nome,
                            email: clt.clt_email,
                            clt_imagem: clt.clt_imagem,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um cliente específico',
                                url: 'http://localhost:3000/clientes/' + clt.clt_codigo

                            }
                        }
                    })
                }

                return res.status(200).send({ response })
                //conn.release();
            }
        )
    })

}

exports.postClientes = (req, res, next) => {
    console.log(req.file);

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })}
        conn.query(
            'INSERT INTO tb_cliente (clt_nome, clt_email, clt_imagem) VALUES (?,?,?)',
            [req.body.clt_nome, req.body.clt_email, req.file.path],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error:error })}

                const response = {
                    mensagem: 'Cliente inserido com sucesso',
                    clienteCriado: {
                        id: result.clt_codigo,
                        nome: req.body.clt_nome,
                        email: req.body.clt_email,
                        clt_imagem: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os clientes',
                            url: 'http://localhost:3000/clientes'

                        }
                    }
                }

                res.status(201).send({ response })

            }
        )
    })

}

exports.getUmCliente = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })}
        conn.query(
            'SELECT * FROM tb_cliente WHERE clt_codigo = ?;',
            [req.params.clt_id],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error:error })}
                
                if (result.length == 0) {
                    return res.status(404).send({ 
                        message: 'Não foi encontrado nenhum cliente com esse ID'
                    })
                }
                const response = {
                    clienteCriado: {
                        id: result[0].clt_codigo,
                        nome: result[0].clt_nome, 
                        email: result[0].clt_email,
                        clt_imagem: result[0].clt_imagem,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os clientes',
                            url: 'http://localhost:3000/clientes'

                        }
                    }
                }

                res.status(200).send({ response })
            }
        )
    })

}

exports.updateCliente = (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error }) }
        conn.query(
            'UPDATE tb_cliente SET clt_nome = ?, clt_email = ? WHERE clt_codigo = ?',
            [
                req.body.clt_nome, 
                req.body.clt_email,
                req.body.clt_id
            ],
            (error, result, field) => {

                conn.release();
                if (error) { return res.status(500).send({ error:error })}

                const response = {
                    mensagem: 'Cliente atualizado com sucesso',
                    clienteAtualizado: {
                        id: req.body.clt_codigo,
                        nome: req.body.clt_nome,
                        email: req.body.clt_email,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um cliente específico',
                            url: 'http://localhost:3000/clientes/' + req.body.clt_id

                        }
                    }
                }

                res.status(202).send({ response });
            }
        )
    });

}

exports.deleteCliente = (req,res,next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error }) }
        conn.query(
            'DELETE FROM tb_cliente WHERE clt_codigo = ?', [req.body.clt_id],
            (error, resultado, field) => {

                conn.release();
                if (error) { return res.status(500).send({ error:error })}
                const response = {
                    mensagem: 'Cliente removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Cadastra um cliente',
                        url: 'http://localhost:3000/clientes',
                        body: {
                            nome: 'String',
                            email: 'String'
                        }
                    }
                }
                res.status(202).send({ response });
            }
        )
    });

}