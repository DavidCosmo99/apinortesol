const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarFuncionario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error }) }
        
        conn.query( 'SELECT * FROM tb_funcionario WHERE fun_email = ?', [req.body.fun_email], (error, result) => { 
            if (error) { return res.status(500).send({ error:error }) }
            if (result.length > 0) {
                return res.status(409).send({ message: 'Funcionário já cadastrado'})
            } else {
                bcrypt.hash(req.body.fun_senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt })}
        
                    conn.query(
                        'INSERT INTO tb_funcionario (fun_nome, fun_email, fun_senha, fun_cargo) VALUES (?,?, ?, ?)',
                        [req.body.fun_nome, req.body.fun_email, hash, req.body.fun_cargo],
                        (error, result) => {
                            conn.release();
                            if (error) { return res.status(500).send({ error:error })}
            
                            const response = {
                                mensagem: 'Funcionário inserido com sucesso',
                                funcionarioCriado: {
                                    id: result.insertId,
                                    nome: req.body.fun_nome,
                                    email: req.body.fun_email,
                                    cargo: req.body.fun_cargo,
                                }
                            }
            
                            res.status(201).send({ response })
            
                        }
                    )
        
                });
            }

        });
        
    });

}

exports.loginFuncionario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error:error }) }

        const query = `SELECT * FROM tb_funcionario WHERE fun_email = ?`;
        conn.query(query, [req.body.fun_email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error:error }) }
            if(results.length < 1) {
                return res.status(401).send({ mensagem: "Falha na autenticação" })
            }
            bcrypt.compare(req.body.fun_senha, results[0].fun_senha, (err, result) => {
                if(err) {
                    return res.status(401).send({ mensagem: "Falha na autenticação" })
                }
                if(result) {
                    const token = jwt.sign({
                        id_funcionario: results[0].fun_codigo,
                        fun_nome: results[0].fun_nome
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn:"1h"
                    });

                    return res.status(200).send({ 
                        mensagem: "Autenticado com sucesso",
                        token: token 
                    });
                }
                    return res.status(401).send({ mensagem: "Falha na autenticação" })
            });
        });
    });
}