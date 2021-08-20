const express = require('express');
const usuarioSistema = require('../models/usuarios-sistema');

const jwt = require('jsonwebtoken');
const SECRET = 'adoteja';

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     usuariosSistema:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *         - telefone
 *         - data_cadastro
 *       properties:
 *         nome:
 *           type: string
 *         cpf:
 *           type: string
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *         telefone:
 *           type: string
 *         data_cadastro:
 *           type: date
 *       example:
 *         nome: João
 *         cpf: 000.000.000-00
 *         email: joao@gmail.com
 *         senha: jX990JkResIgsaA
 *         telefone: (35) 9 1234-5678
 *         data_cadastro: 2021-01-01
 *     usuariosLogin:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *         senha:
 *           type: string
 *       example:
 *         email: joao@gmail.com
 *         senha: jX990JkResIgsaA
 */

/**
  * @swagger
  * tags:
  *   name: UsuariosSistema
  */

/**
 * @swagger
 * /usuarios-sistema:
 *   post:
 *     summary: Adiciona um novo usuário
 *     tags: [UsuariosSistema]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/usuariosSistema'
 *     responses:
 *       200:
 *         description: Usuário inserido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuariosSistema'
 *       500:
 *         description: Não foi possível inserir o usuário
 */
router.post('/usuarios-sistema', async (req, res) => {
    const addUsuario = new usuarioSistema(req.body);
    try {
        await addUsuario.save();
        res.status(201).send(addUsuario);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /usuarios-sistema/login:
 *   post:
 *     summary: Faz o login de um usuário
 *     tags: [UsuariosSistema]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/usuariosLogin'
 *     responses:
 *       200:
 *         description: usuário logado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuariosLogin'
 *       500:
 *         description: Não foi possível logar
 */
 router.post('/usuarios-sistema/login', async (req, res) => {
    try {
        const getUsuario = await usuarioSistema.findOne({ email: req.body.email, senha: req.body.senha });
        if(!getUsuario) {            
            res.status(404).send("Usuário não encontrado");
        }else {
            const token = jwt.sign({sub: getUsuario._id, email: getUsuario.email, name: getUsuario.nome}, SECRET, { expiresIn: 9000 });
            res.status(200).send({auth: true, token});
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /usuarios-sistema/{id}:
 *   get:
 *     summary: Retorna um usuário pelo id
 *     tags: [UsuariosSistema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do usuario
 *     responses:
 *       200:
 *         description: retorna um usuário pelo id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/usuariosSistema'
 */
 router.get('/usuarios-sistema/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const getUsuario = await usuarioSistema.findById(_id);
        res.status(200).send(getUsuario);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /usuarios-sistema/{id}:
 *   patch:
 *     summary: Altera um usuário
 *     tags: [UsuariosSistema]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/usuariosSistema'
 *     responses:
 *       200:
 *         description: Usuário alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuariosSistema'
 *       404:
 *         description: Usuario não encontrado
 *       500:
 *         description: Não foi possível alterar o usuario
 */
 router.patch('/usuarios-sistema/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'senha', 'telefone', 'cpf'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateUsuario = await usuarioSistema.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            if(!updateUsuario){
                return res.status(404).send('Usuário não encontrado');
            }
            else{
                res.send(updateUsuario);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} );

/**
 * @swagger
 * /usuarios-sistema/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [UsuariosSistema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do usuário
 * 
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Não foi possível deletar o usuário
 */
router.delete('/usuarios-sistema/:id', async (req, res) => {    
    try {
        const deleteUsuario = await usuarioSistema.findByIdAndDelete(req.params.id);

        if(!deleteUsuario){
            return res.send(404).send('Usuário não encontrado');
        }
        else{
            res.send(deleteUsuario);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

module.exports = router;