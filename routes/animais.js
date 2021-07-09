const express = require('express');
const router = express.Router();
const {Animal, validate} = require('../models/animais');

router.post('/', async (req, res) => {
    const error = await validate(req.body);

    if(error.message) res.status(400).send(error.message);

    animal = new Animal({
        nome:req.body.nome,
        pelagem:req.body.pelagem,
        sexo:req.body.sexo,
        raca:req.body.raca,
        historia:req.body.historia,
        castrado:req.body.castrado,
        vacinado:req.body.vacinado,
        vermifugado:req.body.vermifugado,
        ong_id:req.body.ong_id,
        especie_id:req.body.especie_id,
        porte_id:req.body.porte_id,
        data_cadastro:req.body.data_cadastro,
    });

    animal.save().then(animal => {
        res.send(animal);
    }).catch(error => {
        res.status(500).send("Animal não cadastrado");
    });
});

router.get("/", (req, res) => {
    Animal.find().populate("Ong").populate("Porte").then(animais => res.send(animais)).catch((error) => {
        res.status(500).send("Não foi possível listar os animais");
    })
});

router.get("/:id", async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    if(!animal) res.status(404).send('Animal não encontrado');
    res.send(animal);
});

router.put("/:id", async (req, res) => {
    const animal = await Animal.findByIdAndUpdate(req.params.id, {
        nome:req.body.nome,
        pelagem:req.body.pelagem,
        sexo:req.body.sexo,
        raca:req.body.raca,
        historia:req.body.historia,
        castrado:req.body.castrado,
        vacinado:req.body.vacinado,
        vermifugado:req.body.vermifugado,
        ong_id:req.body.ong_id,
        especie_id:req.body.especie_id,
        porte_id:req.body.porte_id,
        data_cadastro:req.body.data_cadastro,
    }, {new: true}); 
    if(!animal) res.status(404).send('Animal não encontrado');   
    res.send(animal);
});

router.delete("/:id", async (req, res) => {
    const animal = await Animal.findByIdAndRemove(req.params.id); 
    if(!animal) res.status(404).send('Animal não encontrado');   
    res.send(animal);
});

module.exports = router;