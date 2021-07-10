const express = require('express');
const tipoUsuarioOng = require('../models/tipo-usuario-ong');

const router = new express.Router();

router.post('/tipos-usuarios-ong', async (req, res) => {
    const addTipo = new tipoUsuarioOng(req.body);
    try {
        await addTipo.save();
        res.status(201).send(addTipo);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/tipos-usuarios-ong', async (req, res) => {
    try {
        const getTipos = await tipoUsuarioOng.find({});
        res.status(200).send(getTipos);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tipos-usuarios-ong/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getTipo = await tipoUsuarioOng.findById(_id);
        if(!getTipo){
            res.status(404).send('Tipo de usuário não encontrado');
        }
        else{
            res.status(200).send(getTipo);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

router.patch('/tipos-usuarios-ong/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateTipo = await tipoUsuarioOng.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            if(!updateTipo){
                return res.status(404).send('Tipo de usuário não encontrado');
            }
            else{
                res.send(updateTipo);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} )

router.delete('/tipos-usuarios-ong/:id', async (req, res) => {    
    try {
        const deleteTipo = await tipoUsuarioOng.findByIdAndDelete(req.params.id);

        if(!deleteTipo){
            return res.send(404).send('Tipo de usuário não encontrado');
        }
        else{
            res.send(deleteTipo);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;