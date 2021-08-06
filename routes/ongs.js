const express = require('express');
const ong = require('../models/ongs');

const router = new express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ongsPost:
 *       type: object
 *       required:
 *         - nome
 *         - cnpj
 *         - telefone
 *         - email
 *         - cidade
 *         - estado
 *         - data_cadastro
 *       properties:
 *         nome:
 *           type: string
 *           description: nome da ong
 *         cnpj:
 *           type: string
 *           description: cnpj da ong
 *         telefone:
 *           type: string
 *           description: numero de telefone
 *         email:
 *           type: string
 *           description: e-mail
 *         facebook:
 *           type: string
 *           description: nome da ong
 *         instagram:
 *           type: string
 *           description: cnpj da ong
 *         cidade:
 *           type: string
 *           description: Cidade onde está a ong
 *         estado:
 *           type: string
 *           description: Estado onde está a ong
 *         data_cadastro:
 *           type: Date
 *           description: e-mail
 *       example:
 *         nome: Lar Feliz
 *         cnpj: 00.000.000/0001-00
 *         telefone: (35) 90000-0000
 *         email: onglarfeliz@gmail.com
 *         facebook: larfeliz
 *         instagram: larfelizoficial
 *         cidade: Conceição dos Ouros
 *         eidade: MG
 *         data_cadastro: 2021-01-01
 *     ongsPut:
 *       type: object
 *       required:
 *         - nome
 *         - telefone
 *         - email
 *         - cidade
 *         - estado
 *       properties:
 *         nome:
 *           type: string
 *           description: nome da ong
 *         telefone:
 *           type: string
 *           description: numero de telefone
 *         email:
 *           type: string
 *           description: e-mail
 *         facebook:
 *           type: string
 *           description: nome da ong
 *         instagram:
 *           type: string
 *           description: cnpj da ong
 *         cidade:
 *           type: string
 *           description: cidade onde está a ong
 *         estado:
 *           type: string
 *           description: estado onde está a ong
 *       example:
 *         nome: Lar Feliz
 *         telefone: (35) 90000-0000
 *         email: onglarfeliz@gmail.com
 *         facebook: larfeliz
 *         instagram: larfelizoficial
 *         cidade: Conceição dos Ouros
 *         estado: MG
 */

/**
  * @swagger
  * tags:
  *   name: Ongs
  *   description: Ongs de proteção de animais
  */

/**
 * @swagger
 * /ongs:
 *   post:
 *     summary: Adiciona uma nova ong
 *     tags: [Ongs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ongsPost'
 *     responses:
 *       200:
 *         description: Ong inserida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ongsPost'
 *       500:
 *         description: Não foi possível inserir a ong
 */
router.post('/ongs', async (req, res) => {
    const addOng = new ong(req.body);
    try {
        await addOng.save();
        res.status(201).send(addOng);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /ongs/nome:
 *   get:
 *     summary: Recupera uma ong pelo nome
 *     tags: [Ongs]
 *     parameters:
 *       - in: query
 *         name: descricao
 *         schema:
 *           type: string
 *         required: true
 *         description: id da ong
 *     responses:
 *       200:
 *         description: Ong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ongsPost'
 *       404:
 *         description: Ong não encontrada
 *       500:
 *         description: Não foi possível listar a ong
 */
 router.get('/ongs/nome', async (req, res) => {
    const nome = req.query.descricao;
    try {
        const getOng = await ong.find({ "nome": { $regex: '.*' + nome + '.*' } });
        if(!getOng){
            res.status(404).send('Ong não encontrada');
        }
        else{
            res.status(200).send(getOng);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

/**
 * @swagger
 * /ongs:
 *   get:
 *     summary: Retorna todos as ongs
 *     tags: [Ongs]
 *     responses:
 *       200:
 *         description: Lista todas as ongs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ongsPost'
 */
router.get('/ongs', async (req, res) => {
    try {
        const getOngs = await ong.find({});
        res.status(200).send(getOngs);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /ongs/{id}:
 *   get:
 *     summary: Recupera uma ong pelo id
 *     tags: [Ongs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id da ong
 *     responses:
 *       200:
 *         description: Ong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ongsPost'
 *       404:
 *         description: Ong não encontrada
 *       500:
 *         description: Não foi possível listar a ong
 */
router.get('/ongs/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getOng = await ong.findById(_id);
        if(!getOng){
            res.status(404).send('Ong não encontrado');
        }
        else{
            res.status(200).send(getOng);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

/**
 * @swagger
 * /ongs/{id}:
 *  patch:
 *    summary: Altera uma ong
 *    tags: [Ongs]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id da ong
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ongsPut'
 *    responses:
 *      200:
 *        description: Ong alterada com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ongsPut'
 *      400:
 *        description: Não foi possivel alterar algum campo especifico
 *      404:
 *        description: Ong não encontrada
 *      500:
 *        description: Não foi possível alterar a ong
 */
router.patch('/ongs/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'telefone', 'email', 'facebook', 'instagram', 'cidade', 'estado'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateOng = await ong.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            if(!updateOng){
                return res.status(404).send('Ong não encontrado');
            }
            else{
                res.send(updateOng);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} )

/**
 * @swagger
 * /ongs/{id}:
 *   delete:
 *     summary: Remove uma ong
 *     tags: [Ongs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id da ong
 * 
 *     responses:
 *       200:
 *         description: Ong removida com sucesso
 *       404:
 *         description: Ong não encontrada
 *       500:
 *         description: Não foi possível deletar a Ong
 */
router.delete('/ongs/:id', async (req, res) => {    
    try {
        const deleteOng = await ong.findByIdAndDelete(req.params.id);

        if(!deleteOng){
            return res.send(404).send('Ong não encontrado');
        }
        else{
            res.send(deleteOng);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;