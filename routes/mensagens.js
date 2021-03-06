const express = require('express');
const mensagem = require('../models/mensagens');

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     mensagens:
 *       type: object
 *       required:
 *         - texto
 *         - data_mensagem
 *         - usuario
 *         - contato
 *       properties:
 *         texto:
 *           type: string
 *           description: texto da mensagem
 *         data_mensagem:
 *           type: date
 *         usuario:
 *           type: string
 *           description: id do usuário
 *         contato:
 *           type: string
 *           description: id do contato
 *       example:
 *         texto: texto da mensagem
 *         data_mensagem: 2021-01-01
 *         usuario: id do usuário
 *         contato: id do contato
 */

 /**
  * @swagger
  * tags:
  *   name: Mensagens
  *   description: Mensagens recebidas
  */

/**
 * @swagger
 * /mensagens:
 *   post:
 *     summary: Adiciona uma nova mensagem
 *     tags: [Mensagens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/mensagens'
 *     responses:
 *       200:
 *         description: mensagem inserida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/mensagens'
 *       500:
 *         description: Não foi possível inserir a mensagem
 */
router.post('/mensagens', async (req, res) => {
    const addMensagem = new mensagem(req.body);
    try {
        await addMensagem.save();
        res.status(201).send(addMensagem);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/mensagens', async (req, res) => {
    try {
        const getMensagens = await mensagem.find({});
        res.status(200).send(getMensagens);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /mensagens/{id}:
 *   get:
 *     summary: Recupera uma Mensagem pelo id
 *     tags: [Mensagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id da Mensagem
 *     responses:
 *       200:
 *         description: Mensagem pelo id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensagens'
 *       404:
 *         description: Mensagem não encontrada
 *       500:
 *         description: Não foi possível listar a Mensagem
 */
router.get('/mensagens/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getMensagem = await mensagem.findById(_id);
        if(!getMensagem){
            res.status(404).send('Mensagem não encontrada');
        }
        else{
            res.status(200).send(getMensagem);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

/**
 * @swagger
 * /mensagens/contato/{contatoId}:
 *   get:
 *     summary: Recupera uma listagem de mensagens pelo id do contato
 *     tags: [Mensagens]
 *     parameters:
 *       - in: path
 *         name: contatoId
 *         schema:
 *           type: string
 *         required: true
 *         description: id do contato
 *     responses:
 *       200:
 *         description: Mensagens pelo id do contato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/mensagens'
 *       500:
 *         description: Não foi possível listar as mensagens
 */
router.get('/mensagens/contato/:contatoId', async (req, res) => {    
    try {
        const _contatoId = req.params.contatoId;
        const getMensagens = await mensagem.find({ contato: _contatoId }).populate("usuario");
        res.status(200).send(getMensagens);
    } catch (error) {
        res.status(500).send(error);
    }
} );

/**
 * @swagger
 * /mensagens/{id}:
 *  patch:
 *    summary: Altera uma mensagem
 *    tags: [Mensagens]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id da mensagem
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Mensagens'
 *    responses:
 *      200:
 *        description: Mensagem alterada com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Mensagens'
 *      400:
 *        description: Não foi possivel alterar algum campo especifico
 *      404:
 *        description: Mensagem não encontrada
 *      500:
 *        description: Não foi possível alterar a Mensagem
 */
router.patch('/mensagens/:id', async (req, res) => {
    const _mensagemId = req.params.id;    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['texto'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateMensagem = await mensagem.findByIdAndUpdate(_mensagemId, req.body, {new: true, runValidators: true});

            if(!updateMensagem){
                return res.status(404).send('Mensagem não encontrada');
            }
            else{
                res.send(updateMensagem);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} )

/**
 * @swagger
 * /mensagns/{id}:
 *   delete:
 *     summary: Remove uma mensagem
 *     tags: [Mensagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id da Mensagem
 * 
 *     responses:
 *       200:
 *         description: Mensagem removida com sucesso
 *       404:
 *         description: Mensagem não encontrada
 *       500:
 *         description: Não foi possível deletar a mensagem
 */
router.delete('/mensagens/:id', async (req, res) => {    
    try {
        const deleteMensagem = await mensagem.findByIdAndDelete(req.params.id);

        if(!deleteMensagem){
            return res.send(404).send('Mensagem não encontrado');
        }
        else{
            res.send(deleteMensagem);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;