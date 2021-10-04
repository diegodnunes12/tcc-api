const express = require('express');
const campanha = require('../models/campanhas');

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     campanhas:
 *       type: object
 *       required:
 *         - nome
 *         - descicao
 *         - valor
 *         - chave_pix
 *         - ativo
 *       properties:
 *         nome:
 *           type: string
 *           description: nome da campanha
 *         descricao:
 *           type: string
 *           description: descrição da campanha
 *         valor:
 *           type: number
 *           description: valor da campanha
 *         chave_pix:
 *           type: string
 *           description: chave do pix
 *         ativo:
 *           type: boolean
 *           description: Informa se a campanha está ativa
 */

 /**
  * @swagger
  * tags:
  *   name: Campanhas
  *   description: Campanhas de arrecadação
  */

/**
 * @swagger
 * /campanhas:
 *   post:
 *     summary: Adiciona uma nova campanha
 *     tags: [Campanhas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/campanhas'
 *     responses:
 *       200:
 *         description: Campanha inserida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/campanhas'
 *       500:
 *         description: Não foi possível inserir a campanha
 */
router.post('/campanhas', async (req, res) => {
    const addCampanha = new campanha(req.body);
    try {
        await addCampanha.save();
        res.status(201).send(addCampanha);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /campanhas/ong/{ongId}:
 *   get:
 *     summary: Retorna todos as campanhas de uma ong
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: ongId
 *         schema:
 *           type: string
 *         required: true
 *         description: id da ong
 *     responses:
 *       200:
 *         description: Lista todas as campanhas de uma ong
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/campanhas'
 */
 router.get('/campanhas/ong/:ongId', async (req, res) => {
    try {
        const _ongId = req.params.ongId;
        const getCampanhas = await campanha.find({ ong: _ongId }).populate("ong");
        res.status(200).send(getCampanhas);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /campanhas/{id}:
 *   get:
 *     summary: Recupera uma campanha pelo id
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id da campanha
 *     responses:
 *       200:
 *         description: Campanha pelo id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/campanhas'
 *       404:
 *         description: campanha não encontrada
 *       500:
 *         description: Não foi possível listar a campanha
 */
router.get('/campanhas/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getCampanha = await campanha.findById(_id);
        if(!getCampanha){
            res.status(404).send('Campanha não encontrada');
        }
        else{
            res.status(200).send(getCampanha);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

/**
 * @swagger
 * /campanhas/{id}:
 *  patch:
 *    summary: Altera uma campanha
 *    tags: [Campanhas]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id da campanha
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Campanhas'
 *    responses:
 *      200:
 *        description: Campanha alterada com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Campanhas'
 *      400:
 *        description: Não foi possivel alterar algum campo especifico
 *      404:
 *        description: Campanha não encontrada
 *      500:
 *        description: Não foi possível alterar a Campanha
 */
router.patch('/campanhas/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'descricao', 'valor', 'chave_pix', 'ativo'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateCampanha = await campanha.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            if(!updateCampanha){
                return res.status(404).send('Campanha não encontrada');
            }
            else{
                res.send(updateCampanha);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} )

/**
 * @swagger
 * /campanhas/{id}:
 *   delete:
 *     summary: Remove uma campanha
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id da campanha
 * 
 *     responses:
 *       200:
 *         description: Campanha removida com sucesso
 *       404:
 *         description: Campanha não encontrada
 *       500:
 *         description: Não foi possível deletar a campanha
 */
router.delete('/campanhas/:id', async (req, res) => {    
    try {
        const deleteCampanha = await campanha.findByIdAndDelete(req.params.id);

        if(!deleteCampanha){
            return res.send(404).send('Campanha não encontrado');
        }
        else{
            res.send(deleteCampanha);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;