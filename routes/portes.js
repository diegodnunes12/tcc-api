const express = require('express');
const porte = require('../models/portes');

const jwt = require('jsonwebtoken');
const SECRET = 'adoteja';

function verifyJwt(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) return res.status(401).end();
        req.usuario = decoded.usuario;
        req.ong = decoded.ong;

        next();
    });
}

const router = new express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     portes:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           description: descrição do porte
 *       example:
 *         _id: 60e9fbd0c71254fd715ba5f1,
 *         nome: Grande
 */

 /**
  * @swagger
  * tags:
  *   name: Portes
  *   description: Porte dos animais
  */

router.post('/portes', async (req, res) => {
    const addPorte = new porte(req.body);
    try {
        await addPorte.save();
        res.status(201).send(addPorte);
    } catch (error) {
        res.status(400).send(error);
    }
});



/**
 * @swagger
 * /portes:
 *   get:
 *     summary: Retorna todos os portes
 *     tags: [Portes]
 *     responses:
 *       200:
 *         description: Lista todos os portes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/portes'
 */
router.get('/portes', verifyJwt, async (req, res) => {
    try {
        console.log(req.ong)
        const getPortes = await porte.find({});
        res.status(200).send(getPortes);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /portes/{id}:
 *   get:
 *     summary: Recupera um porte pelo id
 *     tags: [Portes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do porte
 *     responses:
 *       200:
 *         description: Porte pelo id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/portes'
 *       404:
 *         description: Porte não encontrado
 *       500:
 *         description: Não foi possível listar o porte
 */
router.get('/portes/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getPorte = await porte.findById(_id);
        if(!getPorte){
            res.status(404).send('Porte não encontrado');
        }
        else{
            res.status(200).send(getPorte);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

router.patch('/portes/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updatePorte = await porte.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            if(!updatePorte){
                return res.status(404).send('Porte não encontrado');
            }
            else{
                res.send(updatePorte);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} )

router.delete('/portes/:id', async (req, res) => {    
    try {
        const deletePorte = await porte.findByIdAndDelete(req.params.id);

        if(!deletePorte){
            return res.send(404).send('Porte não encontrado');
        }
        else{
            res.send(deletePorte);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;