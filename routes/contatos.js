const express = require('express');
const contato = require('../models/contatos');

const router = new express.Router();

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