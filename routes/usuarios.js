const express = require('express');
const usuario = require('../models/usuarios');

const router = new express.Router();

router.post('/usuarios', async (req, res) => {
    const addUsuario = new usuario(req.body);
    try {
        await addUsuario.save();
        res.status(201).send(addUsuario);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/usuarios', async (req, res) => {
    try {
        const getUsuarios = await usuario.find({});
        res.status(200).send(getUsuarios);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/usuarios/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const getUsuario = await usuario.findById(_id);
        if(!getUsuario){
            res.status(404).send('Usuário não encontrada');
        }
        else{
            res.status(200).send(getUsuario);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

router.patch('/usuarios/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'senha', 'data_nascimento', 'telefone', 'endereco'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
            const updateUsuario = await usuario.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

            if(!updateUsuario){
                return res.status(404).send('Usuário não encontrado');
            }
            else{
                res.send(updateUsuario);
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
} )

router.delete('/usuarios/:id', async (req, res) => {    
    try {
        const deleteUsuario = await usuario.findByIdAndDelete(req.params.id);

        if(!deleteUsuario){
            return res.send(404).send('Usuário não encontrado');
        }
        else{
            res.send(deleteUsuario);
        }
    } catch (error) {
        res.status(500).send(error);
    }
} )

module.exports = router;