const express = require('express');
const mensagem = require('../models/mensagens');

const router = new express.Router();

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

router.get('/mensagens/contato/:contatoId', async (req, res) => {    
    try {
        const _contatoId = req.params.contatoId;
        const getMensagens = await mensagem.find({ contato: _contatoId });
        res.status(200).send(getMensagens);
    } catch (error) {
        res.status(500).send(error);
    }
} );

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