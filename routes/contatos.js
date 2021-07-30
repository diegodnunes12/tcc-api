const express = require('express');
const contato = require('../models/contatos');

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     contatos:
 *       type: object
 *       required:
 *         - data_contato
 *         - animal
 *       properties:
 *         data_contato:
 *           type: date
 *         animal:
 *           type: string
 *           description: id do animal
 *       example:
 *         data_contato: 2021-01-01
 *         animal: id_do_animal
 */

/**
  * @swagger
  * tags:
  *   name: Contatos
  */

/**
 * @swagger
 * /contatos:
 *   post:
 *     summary: Adiciona um novo contato
 *     tags: [Contatos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/contatos'
 *     responses:
 *       200:
 *         description: Contato realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/contatos'
 *       500:
 *         description: Não foi possível realizar o contato
 */
router.post('/contatos', async (req, res) => {
    const addContato = new contato(req.body);
    try {
        await addContato.save();
        res.status(201).send(addContato);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/contatos', async (req, res) => {
    try {
        const getContatos = await contato.find({});
        res.status(200).send(getContatos);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /contatos/{id}:
 *   get:
 *     summary: Recupera um contato pelo id
 *     tags: [Contatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do contato
 *     responses:
 *       200:
 *         description: Contato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/contatos'
 *       404:
 *         description: Contato não encontrada
 *       500:
 *         description: Não foi possível listar o contato
 */
router.get('/contatos/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getContato = await contato.findById(_id);
        if(!getContato){
            res.status(404).send('Contato não encontrada');
        }
        else{
            res.status(200).send(getContato);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

router.delete('/contatos/:id', async (req, res) => {    
    try {
        const deleteContato = await contato.findByIdAndDelete(req.params.id);

        if(!deleteContato){
            return res.send(404).send('Contato não encontrado');
        }
        else{
            res.send(deleteContato);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;