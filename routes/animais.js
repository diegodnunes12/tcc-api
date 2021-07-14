const express = require('express');
const animal = require('../models/animais');

const router = new express.Router();

router.post('/animais', async (req, res) => {
    const addAnimal = new animal(req.body);
    try {
        await addAnimal.save();
        res.status(201).send(addAnimal);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/animais', async (req, res) => {
    try {
        const getAnimais = await animal.find({}).populate("especie").populate("porte").populate("ong");
        res.status(200).send(getAnimais);
    } catch (error) {
        res.status(500).send(error);
    }
});

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
} )

router.patch('/animais/:id', async (req, res) => {    
    const dataUpdate = Object.keys(req.body);
    const allowedUpdate = ['nome', 'pelagem', 'sexo', 'raca', 'idade', 'historia', 'castrado', 'vacinado', 'vermifugado', 'ong_id', 'especie_id', 'porte_id'];
    const isValidationOperation = dataUpdate.every( (dataUpdate) => allowedUpdate.includes(dataUpdate));

    if(!isValidationOperation){
        return res.status(400).send({error: 'Não foi possivel alterar algum campo especifico'});
    }
    else{
        try {
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
} )

router.delete('/animais/:id', async (req, res) => {    
    try {
        const deleteAnimal = await animal.findByIdAndDelete(req.params.id);

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