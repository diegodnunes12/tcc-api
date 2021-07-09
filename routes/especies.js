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

module.exports = router;