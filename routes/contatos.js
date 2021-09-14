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
 *         - usuario
 *         - ong
 *       properties:
 *         data_contato:
 *           type: date
 *         animal:
 *           type: string
 *           description: id do animal
 *         usuario:
 *           type: string
 *           description: id do ususario que criou o contato
 *         ong:
 *           type: string
 *           description: id da ong que o animal pertence
 *       example:
 *         data_contato: 2021-01-01
 *         animal: id_do_animal
 *         usuario: id_do_usuario
 *         ong: id_da_ong
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
        const getContato = await contato.findById(_id).populate("animal").populate("ong");
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

/**
 * @swagger
 * /contatos/ong/{ongId}:
 *   get:
 *     summary: Retorna todos os contatos de uma ong
 *     tags: [Contatos]
 *     parameters:
 *       - in: path
 *         name: ongId
 *         schema:
 *           type: string
 *         required: true
 *         description: id da ong
 *     responses:
 *       200:
 *         description: Lista todas os contatos de uma ong
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/contatos'
 */
router.get('/contatos/ong/:ongId', async (req, res) => {
    try {
        const _ongId = req.params.ongId;
        const getContatos = await contato.find({ ong: _ongId }).populate("ong");
/*         .populate({
            path: 'animal',
            populate: [
                { path: 'especie' },
                { path: 'porte' },
            ]            
        }) */
        res.status(200).send(getContatos);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/contatos/relatorios/ong/:ongId', async (req, res) => {
    try {
        const dataInicial = new Date(req.query.dataInicial)
        const dataFinal = new Date(req.query.dataFinal)
        const _ongId = req.params.ongId;
        const getContatos = await contato.find({ ong: _ongId, data_contato: { $gte: dataInicial, $lt: dataFinal } }).populate("ong");
        res.status(200).send(getContatos);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /contatos/usuario/{usuarioId}:
 *   get:
 *     summary: Retorna todos os contatos de um usuario
 *     tags: [Contatos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: id do usuário
 *     responses:
 *       200:
 *         description: Lista todas os contatos de um usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/contatos'
 */
 router.get('/contatos/usuario/:usuarioId', async (req, res) => {
    try {
        const _usuarioId = req.params.usuarioId;
        const getContatos = await contato.find({ "usuario._id": _usuarioId }).populate("animal").populate("ong");
        res.status(200).send(getContatos);
    } catch (error) {
        res.status(500).send(error);
    }
});

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
} );

module.exports = router;