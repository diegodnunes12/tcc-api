const express = require('express');
const usuarioOng = require('../models/usuarios-ong');

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     usuariosOng:
 *       type: object
 *       required:
 *         - usuario
 *         - ong
 *       properties:
 *         usuario:
 *           type: string
 *           description: id do usuário
 *         ong:
 *           type: string
 *           description: id da ong
 *       example:
 *         usuario: id do usuario
 *         ong: id da ong
 */

/**
  * @swagger
  * tags:
  *   name: Usuários-Ong
  */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Adiciona um novo usuário ong
 *     tags: [Usuários-Ong]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/usuariosOng'
 *     responses:
 *       200:
 *         description: Usuário inserido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/usuariosOng'
 *       500:
 *         description: Não foi possível inserir o usuário
 */
router.post('/usuarios-ong', async (req, res) => {
    const addUsuario = new usuarioOng(req.body);
    try {
        await addUsuario.save();
        res.status(201).send(addUsuario);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/usuarios-ong', async (req, res) => {
    try {
        const getUsuarios = await usuarioOng.find({});
        res.status(200).send(getUsuarios);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/usuarios-ong/:id', async (req, res) => {    
    try {
        const deleteUsuario = await usuarioOng.findByIdAndDelete(req.params.id);

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