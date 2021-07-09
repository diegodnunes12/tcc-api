const express = require('express');
const router = express.Router();
const {Porte, validate} = require('../models/portes');

router.post('/', async (req, res) => {
    const error = await validate(req.body);
    if(error.message) res.status(400).send(error.message);
    porte = new Porte({
        nome:req.body.nome
    });

    porte.save().then(porte => {
        res.send(porte);
    }).catch(error => {
        res.status(500).send("Porte não cadastrado");
    });
});

router.get("/", (req, res) => {
    Porte.find().then(portes => res.send(portes)).catch((error) => {
        res.status(500).send("Não foi possível listar os portes");
    })
});

router.get("/:id", async (req, res) => {
    const porte = await Porte.findById(req.params.id);
    if(!porte) res.status(404).send('Porte não encontrado');
    res.send(porte);
});

router.put("/:id", async (req, res) => {
    const porte = await Porte.findByIdAndUpdate(req.params.id, {
        nome: req.body.nome
    }, {new: true}); 
    if(!porte) res.status(404).send('Porte não encontrado');   
    res.send(porte);
});

router.delete("/:id", async (req, res) => {
    const porte = await Porte.findByIdAndRemove(req.params.id); 
    if(!porte) res.status(404).send('Porte não encontrado');   
    res.send(porte);
});

module.exports = router;