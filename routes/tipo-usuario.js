const express = require('express');
const tipoUsuario = require('../models/tipo-usuario');

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     tipos-usuarios:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           description: descrição do tipo de usuário
 *       example:
 *         _id: 60e9fbd0c71254fd715ba5f1,
 *         nome: Operador
 */

 /**
  * @swagger
  * tags:
  *   name: Tipos-Usuarios
  *   description: Permissões do usuário
  */
 
router.post('/tipos-usuarios', async (req, res) => {
    const addTipo = new tipoUsuario(req.body);
    try {
        await addTipo.save();
        res.status(201).send(addTipo);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /tipos-usuarios:
 *   get:
 *     summary: Retorna todos os tipos de usuários
 *     tags: [Tipos-Usuarios]
 *     responses:
 *       200:
 *         description: Lista todos os tipos de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tipos-usuarios'
 */
router.get('/tipos-usuarios', async (req, res) => {
    try {
        const getTipos = await tipoUsuario.find({});
        res.status(200).send(getTipos);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /tipos-usuarios/{id}:
 *   get:
 *     summary: Recupera um tipo de usuário pelo id
 *     tags: [Tipos-Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do tipo de usuário
 *     responses:
 *       200:
 *         description: Tipo de usuário pelo id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tipos-usuarios'
 *       404:
 *         description: Tipo de usuário não encontrado
 *       500:
 *         description: Não foi possível listar o tipo de usuário
 */
router.get('/tipos-usuarios/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getTipo = await tipoUsuario.findById(_id);
        if(!getTipo){
            res.status(404).send('Tipo de usuário não encontrado');
        }
        else{
            res.status(200).send(getTipo);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

router.delete('/tipos-usuarios/:id', async (req, res) => {    
    try {
        const deleteTipo = await tipoUsuarioOng.findByIdAndDelete(req.params.id);

        if(!deleteTipo){
            return res.send(404).send('Tipo de usuário não encontrado');
        }
        else{
            res.send(deleteTipo);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;