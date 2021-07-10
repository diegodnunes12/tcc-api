const express = require('express');
const especie = require('../models/especies');

const router = new express.Router();

router.post('/especies', async (req, res) => {
    const addEspecie = new especie(req.body);
    try {
        await addEspecie.save();
        res.status(201).send(addEspecie);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/especies', async (req, res) => {
    try {
        const getEspecies = await especie.find({});
        res.status(200).send(getEspecies);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/especies/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getEspecie = await especie.findById(_id);
        if(!getEspecie){
            res.status(404).send('Espécie não encontrada');
        }
        else{
            res.status(200).send(getEspecie);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

router.patch('/especies/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateEspecie = await especie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            if(!updateEspecie){
                return res.status(404).send('Espécie não encontrado');
            }
            else{
                res.send(updateEspecie);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} )

router.delete('/especies/:id', async (req, res) => {    
    try {
        const deleteEspecie = await especie.findByIdAndDelete(req.params.id);

        if(!deleteEspecie){
            return res.send(404).send('Espécie não encontrado');
        }
        else{
            res.send(deleteEspecie);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;