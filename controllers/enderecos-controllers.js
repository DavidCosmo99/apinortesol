const mysql = require('../mysql').pool;

exports.getEnderecos = (req,res,next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })}
        conn.query(
        `SELECT tb_endereco.end_codigo,
                tb_endereco.end_rua,
                tb_endereco.end_bairro,
                tb_cliente.clt_nome,
                tb_cliente.clt_email
                FROM tb_endereco INNER JOIN 
                tb_cliente ON tb_cliente.clt_codigo = tb_endereco.tb_cliente_clt_codigo	`,
            (error, result, field) => {
                if (error) { return res.status(500).send({ error:error })}

                const response = {
                    quantidade: result.length,
                    enderecos: result.map(end => {
                        return {
                            id_endereco: end.end_codigo,
                            rua: end.end_rua,
                            bairro: end.end_bairro,
                            cliente: {
                                nome: end.clt_nome,
                                email: end.clt_email
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um endereco específico',
                                url: 'http://localhost:3000/enderecos/' + end.end_codigo

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

exports.postEndereco = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })}
        conn.query( 'SELECT * FROM tb_cliente WHERE clt_codigo = ?', [req.body.clt_codigo],
        (error, result, field) => { 
            if (error) { return res.status(500).send({ error:error })}

            if (result.length == 0) {
                return res.status(404).send({ 
                    message: 'Cliente não encontrado'
                })
            }

            conn.query(
                'INSERT INTO tb_endereco (end_rua, end_bairro, tb_cliente_clt_codigo) VALUES (?,?, ?)',
                [req.body.end_rua, req.body.end_bairro, req.body.clt_codigo],
                (error, result, field) => {
                    conn.release();
                    if (error) { return res.status(500).send({ error:error })}
    
                    const response = {
                        mensagem: 'Cliente inserido com sucesso',
                        enderecoCriado: {
                            id: result.end_codigo,
                            id_cliente: req.body.clt_codigo,
                            rua: req.body.end_rua,
                            bairro: req.body.end_bairro,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os enderecos',
                                url: 'http://localhost:3000/enderecos'
    
                            }
                        }
                    }
    
                    res.status(201).send({ response })
    
                }
            )

        });
    });

}

exports.getUmEndereco = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error })}
        conn.query(
            `SELECT tb_endereco.end_codigo,
            tb_endereco.end_rua,
            tb_endereco.end_bairro,
            tb_cliente.clt_nome,
            tb_cliente.clt_email
            FROM tb_endereco INNER JOIN 
            tb_cliente ON tb_cliente.clt_codigo = tb_endereco.tb_cliente_clt_codigo 
            WHERE tb_endereco.end_codigo = ?;`,
            [req.params.end_codigo],
            (error, result, field) => {
                if (error) { return res.status(500).send({ error:error })}
                
                if (result.length == 0) {
                    return res.status(404).send({ 
                        message: 'Não foi encontrado nenhum endereço com esse ID'
                    })
                }
                const response = {
                    endereco: {
                        id_endereco: result[0].end_codigo,
                        rua: result[0].end_rua, 
                        bairro: result[0].end_bairro,
                        cliente: {
                            nome: result[0].clt_nome,
                            email: result[0].clt_email,
                        },
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os endereços',
                            url: 'http://localhost:3000/enderecos'

                        }
                    }
                }

                res.status(200).send({ response })
            }
        )
    })

}

exports.updateEndereco = (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error }) }
        conn.query(
            'UPDATE tb_endereco SET end_rua = ?, end_bairro = ? WHERE end_codigo = ?',
            [
                req.body.end_rua, 
                req.body.end_bairro,
                req.body.end_codigo
            ],
            (error, result, field) => {

                conn.release();
                if (error) { return res.status(500).send({ error:error })}

                const response = {
                    mensagem: 'Endereço atualizado com sucesso',
                    clienteAtualizado: {
                        id: req.body.end_codigo,
                        rua: req.body.end_rua,
                        bairro: req.body.end_bairro,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um endereço específico',
                            url: 'http://localhost:3000/enderecos/' + req.body.end_codigo

                        }
                    }
                }

                res.status(202).send({ response });
            }
        )
    });

}

exports.deleteEndereco = (req,res,next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error }) }
        conn.query(
            'DELETE FROM tb_endereco WHERE end_codigo = ?', [req.body.end_codigo],
            (error, resultado, field) => {

                conn.release();
                if (error) { return res.status(500).send({ error:error })}
                const response = {
                    mensagem: 'Endereço removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Cadastra um endereço',
                        url: 'http://localhost:3000/enderecos',
                        body: {
                            clt_codigo: 'Number',
                            rua: 'String',
                            bairro: 'String'
                        }
                    }
                }
                res.status(202).send({ response });
            }
        )
    });

}