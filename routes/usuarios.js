const express = require('express');
const usuario = require('../models/usuarios');

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     usuariosPost:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - email
 *         - senha
 *         - telefone
 *         - tipo_usuario
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
 *         tipo_usuario:
 *           type: string
 *           description: id do tipo de usuário
 *         ong:
 *           type: string
 *           description: Caso o usuário for usuário de uma ong deve inserir o id da ong
 *         data_cadastro:
 *           type: date
 *       example:
 *         nome: João
 *         cpf: 000.000.000-00
 *         email: joao@gmail.com
 *         senha: jX990JkResIgsaA
 *         telefone: (35) 9 1234-5678
 *         tipo_usuario: id do tipo de usuário
 *         ong: id da ong
 *         data_cadastro: 2021-01-01
 *     usuariosPut:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - email
 *         - senha
 *         - telefone
 *         - tipo_usuario
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
 *         tipo_usuario:
 *           type: string
 *           description: id do tipo de usuário
 *       example:
 *         nome: João
 *         cpf: 000.000.000-00
 *         email: joao@gmail.com
 *         senha: jX990JkResIgsaA
 *         telefone: (35) 9 1234-5678
 *         tipo_usuario: id do tipo de usuário
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
  *   name: Usuarios
  */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Adiciona um novo usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/usuariosPost'
 *     responses:
 *       200:
 *         description: Usuário inserido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuariosPost'
 *       500:
 *         description: Não foi possível inserir o usuário
 */
router.post('/usuarios', async (req, res) => {
    const addUsuario = new usuario(req.body);
    try {
        await addUsuario.save();
        res.status(201).send(addUsuario);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /usuarios/ong/{ongId}:
 *   get:
 *     summary: Retorna todos os usuarios de uma ong
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: ongId
 *         schema:
 *           type: string
 *         required: true
 *         description: id da ong
 *     responses:
 *       200:
 *         description: Lista todas os usuários de uma ong
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/usuariosPost'
 */
router.get('/usuarios/ong/:ongId', async (req, res) => {
    try {
        const _ongId = req.params.ongId;
        const getUsuarios = await usuario.find({ ong: _ongId });
        res.status(200).send(getUsuarios);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Recupera um usuário pelo id
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do usuário
 *     responses:
 *       200:
 *         description: Usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuarioPost'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Não foi possível listar o usuário
 */
router.get('/usuarios/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getUsuario = await usuario.findById(_id);
        if(!getUsuario){
            res.status(404).send('Usuário não encontrada');
        }
        else{
            res.status(200).send(getUsuario);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

/**
 * @swagger
 * /usuarios/sistema:
 *   post:
 *     summary: Recupera um usuário pelo email e senha
 *     tags: [Usuarios]
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
 router.post('/usuarios/sistema', async (req, res) => {
    try {
        const getUsuario = await usuario.findOne({ email: req.body.email, senha: req.body.senha });
        if(!getUsuario) {            
            res.status(404).send("Usuário não encontrado");
        }else {
            res.status(200).send(getUsuario);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /usuarios/sistema-admin:
 *   post:
 *     summary: Recupera um usuário pelo email e senha e verifica se ele possui uma ong_id
 *     tags: [Usuarios]
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
 router.post('/usuarios/sistema-admin', async (req, res) => {
    try {
        const getUsuario = await usuario.findOne({ email: req.body.email, senha: req.body.senha });
        console.log(getUsuario)
        if(!getUsuario) {            
            res.status(404).send("Usuário não encontrado");
        }else {
            if(getUsuario.ong !== null) {
                res.status(200).send(getUsuario);
            }else {
                res.status(404).send("Usuário não encontrado");
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
  

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Altera um usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/usuariosPut'
 *     responses:
 *       200:
 *         description: Usuário alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuariosPut'
 *       404:
 *         description: Usuario não encontrado
 *       500:
 *         description: Não foi possível alterar o usuario
 */
router.patch('/usuarios/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'senha', 'telefone', 'tipo_usuario'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateUsuario = await usuario.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

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
 * /usuaios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuarios]
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
router.delete('/usuarios/:id', async (req, res) => {    
    try {
        const deleteUsuario = await usuario.findByIdAndDelete(req.params.id);

        if(!deleteUsuario){
            return res.send(404).send('Usuário não encontrado');
        }
        else{
            res.send(deleteUsuario);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;