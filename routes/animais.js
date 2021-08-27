const express = require('express');
const animal = require('../models/animais');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
});

const upload = multer({ storage }).single('imagem');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

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
 *     animaisPost:
 *       type: object
 *       required:
 *         - nome
 *         - sexo
 *         - castrado
 *         - vacinado
 *         - vermifugado
 *         - ong
 *         - especie
 *         - porte
 *         - data_cadastro
 *       properties:
 *         nome:
 *           type: string
 *         pelagem:
 *           type: string
 *           description: Tipo do pelo ou cor do animal
 *         sexo:
 *           type: string
 *         raca:
 *           type: string
 *         idade:
 *           type: string
 *         historia:
 *           type: string
 *           description: História do animal
 *         castrado:
 *           type: boolean
 *           description: Informa se o animal é castrado
 *         vacinado:
 *           type: boolean
 *           description: Informa se o animal é vacinado
 *         vermifugado:
 *           type: boolean
 *           description: Informa se o animal está vermifugado
 *         ong:
 *           type: string
 *           description: Id da ong que pertence o animal
 *         especie:
 *           type: string
 *           description: Id da espécie que pertence o animal
 *         porte:
 *           type: string
 *           description: Id do porte do animal
 *         data_cadastro:
 *           type: date
 *       example:
 *         nome: Totó
 *         pelagem: Amarela
 *         sexo: Macho
 *         raca: SRD
 *         idade: 2 meses
 *         historia: Cachorro encontrado no mercado municipal
 *         castrado: false
 *         vacinado: false
 *         vermifugado: true
 *         ong: id_ong
 *         especie: id_especie
 *         porte: id_porte
 *         data_cadastro: 2021-01-01
 *     animaisPut:
 *       type: object
 *       required:
 *         - nome
 *         - sexo
 *         - castrado
 *         - vacinado
 *         - vermifugado
 *         - especie
 *         - porte
 *       properties:
 *         nome:
 *           type: string
 *         pelagem:
 *           type: string
 *           description: Tipo do pelo ou cor do animal
 *         sexo:
 *           type: string
 *         raca:
 *           type: string
 *         idade:
 *           type: string
 *         historia:
 *           type: string
 *           description: História do animal
 *         castrado:
 *           type: boolean
 *           description: Informa se o animal é castrado
 *         vacinado:
 *           type: boolean
 *           description: Informa se o animal é vacinado
 *         vermifugado:
 *           type: boolean
 *           description: Informa se o animal está vermifugado
 *         especie:
 *           type: string
 *           description: Id da espécie que pertence o animal
 *         porte:
 *           type: string
 *           description: Id do porte do animal
 *       example:
 *         nome: Totó
 *         pelagem: Amarela
 *         sexo: Macho
 *         raca: SRD
 *         idade: 2 meses
 *         historia: Cachorro encontrado no mercado municipal
 *         castrado: false
 *         vacinado: false
 *         vermifugado: true
 *         especie: id_especie
 *         porte: id_porte
 */

/**
  * @swagger
  * tags:
  *   name: Animais
  *   description: Animais
  */

/**
 * @swagger
 * /animais:
 *   post:
 *     summary: Adiciona um novo animal
 *     tags: [Animais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/animaisPost'
 *     responses:
 *       200:
 *         description: Animal inserido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/animaisPost'
 *       500:
 *         description: Não foi possível inserir o animal
 */
router.post('/animais', upload, async (req, res) => {  
    let imageName = "";
    if(req.file) {
        let file = req.file.originalname.split(".");
        const fileType = file[file.length - 1];
        imageName = `${uuidv4()}.${fileType}`; 
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `imagens/${imageName}`,
            Body: req.file.buffer,
            ACL:'public-read'
        }
        s3.upload(params, (error, data) => {
            if(error) {
                res.status(500).send(error)
            }        
        });
    } 

    let addAnimal = new animal(req.body);
    addAnimal.imagem = imageName;
    try {
        await addAnimal.save();
        res.status(201).send(addAnimal);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /animais:
 *   get:
 *     summary: Retorna todos os animais
 *     tags: [Animais]
 *     responses:
 *       200:
 *         description: Lista todas os animais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/animaisPost'
 */
router.get('/animais', async (req, res) => {
    try {
        const getAnimais = await animal.find({}).populate("especie").populate("porte").populate("ong");
        res.status(200).send(getAnimais);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /animais/ong/{ongId}:
 *   get:
 *     summary: Retorna todos os animais de uma ong
 *     tags: [Animais]
 *     parameters:
 *       - in: path
 *         name: ongId
 *         schema:
 *           type: string
 *         required: true
 *         description: id da ong
 *     responses:
 *       200:
 *         description: Lista todas os animais de uma ong
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/animaisPost'
 */
 router.get('/animais/ong/:ongId', async (req, res) => {
    try {
        const _ongId = req.params.ongId;
        const getAnimais = await animal.find({ ong: _ongId }).populate("especie").populate("porte").populate("ong");
        res.status(200).send(getAnimais);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /animais/filtro:
 *   get:
 *     summary: Retorna todos os animais de um determinado filtro
 *     tags: [Animais]
 *     parameters:
 *       - in: query
 *         name: ong
 *         schema:
 *           type: string
 *         required: false
 *         description: id da ong
 *       - in: query
 *         name: especie
 *         schema:
 *           type: string
 *         required: false
 *         description: id da especie do animal
 *       - in: query
 *         name: porte
 *         schema:
 *           type: string
 *         required: false
 *         description: id do porte do animal
 *       - in: query
 *         name: sexo
 *         schema:
 *           type: string
 *         required: false
 *         description: id do sexo do animal
 *     responses:
 *       200:
 *         description: Lista todas os animais pela busca
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/animaisPost'
 */
 router.get('/animais/filtro', async (req, res) => {
    try {
        let getAnimais = await animal.find(req.query).populate("especie").populate("porte").populate("ong");
        res.status(200).send(getAnimais);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * @swagger
 * /animais/{id}:
 *   get:
 *     summary: Recupera uma animal pelo id
 *     tags: [Animais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do animal
 *     responses:
 *       200:
 *         description: Ong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/animaisPost'
 *       404:
 *         description: Animal não encontrada
 *       500:
 *         description: Não foi possível listar o animal
 */
router.get('/animais/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getAnimal = await animal.findById(_id).populate("especie").populate("porte").populate("ong");
        if(!getAnimal){
            res.status(404).send('Animal não encontrado');
        }
        else{
            res.status(200).send(getAnimal);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} );

/**
 * @swagger
 * /animais/{id}:
 *   patch:
 *     summary: Altera um animal
 *     tags: [Animais]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id do animal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/animaisPut'
 *     responses:
 *       200:
 *         description: Animal alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/animaisPut'
 *       404:
 *         description: Animal não encontrado
 *       500:
 *         description: Não foi possível alterar o animal
 */
router.patch('/animais/:id', upload, async (req, res) => { 
    let imageName = "";
    if(req.file) {
        let file = req.file.originalname.split(".");
        const fileType = file[file.length - 1];
        imageName = `${uuidv4()}.${fileType}`; 
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `imagens/${imageName}`,
            Body: req.file.buffer,
            ACL:'public-read'
        }
        s3.upload(params, (error, data) => {
            if(error) {
                res.status(500).send(error)
            }        
        });
    }

    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'pelagem', 'sexo', 'raca', 'idade', 'historia', 'castrado', 'vacinado', 'vermifugado', 'especie', 'porte', 'imagem'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            if(req.file) {
                req.body.imagem = imageName;
            }
            const updateAnimal = await animal.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});            

            if(!updateAnimal){
                return res.status(404).send('Animal não encontrado');
            }
            else{
                res.send(updateAnimal);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} );

/**
 * @swagger
 * /animais/{id}:
 *   delete:
 *     summary: Remove um animal
 *     tags: [Animais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id do animal
 * 
 *     responses:
 *       200:
 *         description: Animal removido com sucesso
 *       404:
 *         description: Animal não encontrado
 *       500:
 *         description: Não foi possível deletar o animal
 */
router.delete('/animais/:id', async (req, res) => {    
    try {
        const deleteAnimal = await animal.findByIdAndDelete(req.params.id);
        if(deleteAnimal.imagem !== "") {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `imagens/${deleteAnimal.imagem}`,
            }
            s3.deleteObject(params, (error, data) => {
                if(error) {
                    res.status(500).send(error)
                }        
            });
        };

        if(!deleteAnimal){
            return res.send(404).send('Animal não encontrado');
        }
        else{
            res.send(deleteAnimal);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;