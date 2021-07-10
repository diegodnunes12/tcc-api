const express = require('express');
const ong = require('../models/ongs');

const router = new express.Router();

router.post('/ongs', async (req, res) => {
    const addOng = new ong(req.body);
    try {
        await addOng.save();
        res.status(201).send(addOng);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/ongs', async (req, res) => {
    try {
        const getOngs = await ong.find({});
        res.status(200).send(getOngs);
    } catch (error) {
        res.status(500).send(error);
    }
});

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
} )

router.patch('/ongs/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'telefone', 'email', 'facebook', 'instagram', 'endereco'];
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