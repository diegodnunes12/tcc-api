const express = require('express');
const router = express.Router();
const {Especie, validate} = require('../models/especies');

router.post('/', async (req, res) => {
    const error = await validate(req.body);

    if(error.message) res.status(400).send(error.message);

    especie = new Especie({
        nome:req.body.nome
    });

    especie.save().then(especie => {
        res.send(especie);
    }).catch(error => {
        res.status(500).send("Especie não cadastrada");
    });
});

router.get("/", (req, res) => {
    Especie.find().then(especies => res.send(especies)).catch((error) => {
        res.status(500).send("Não foi possível listar as espécies");
    })
});

router.get("/:id", async (req, res) => {
    const especie = await Especie.findById(req.params.id);
    if(!especie) res.status(404).send('Espécie não encontrada');
    res.send(especie);
});

router.put("/:id", async (req, res) => {
    const especie = await Especie.findByIdAndUpdate(req.params.id, {
        nome: req.body.nome
    }, {new: true}); 
    if(!especie) res.status(404).send('Espécie não encontrada');   
    res.send(especie);
});

router.delete("/:id", async (req, res) => {
    const especie = await Especie.findByIdAndRemove(req.params.id); 
    if(!especie) res.status(404).send('Espécie não encontrada');   
    res.send(especie);
});

module.exports = router;