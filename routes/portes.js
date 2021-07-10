const express = require('express');
const porte = require('../models/portes');

const router = new express.Router();

router.post('/portes', async (req, res) => {
    const addPorte = new porte(req.body);
    try {
        await addPorte.save();
        res.status(201).send(addPorte);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/portes', async (req, res) => {
    try {
        const getPortes = await porte.find({});
        res.status(200).send(getPortes);
    } catch (error) {
        res.status(500).send(error);
    }
});

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