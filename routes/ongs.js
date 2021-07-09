const express = require('express');
const router = express.Router();
const {Ong, validate} = require('../models/ongs');

router.post('/', async (req, res) => {
    const error = await validate(req.body);
    if(error.message) res.status(400).send(error.message);
    ong = new Ong({
        nome:req.body.nome,
        cnpj:req.body.cnpj,
        telefone:req.body.telefone,
        email:req.body.email,
        facebook:req.body.facebook,
        instagram:req.body.instagram,
        endereco:req.body.endereco,
        data_cadastro:req.body.data_cadastro
    });

    ong.save().then(ong => {
        res.send(ong);
    }).catch(error => {
        res.status(500).send("Ong não cadastrada");
    });
});

router.get("/", (req, res) => {
    Ong.find().then(ongs => res.send(ongs)).catch((error) => {
        res.status(500).send("Não foi possível listar as Ongs");
    })
});

router.get("/:id", async (req, res) => {
    const ong = await Ong.findById(req.params.id);
    if(!ong) res.status(404).send('Ong não encontrada');
    res.send(ong);
});

router.put("/:id", async (req, res) => {
    const ong = await Ong.findByIdAndUpdate(req.params.id, {
        nome:req.body.nome,
        cnpj:req.body.cnpj,
        telefone:req.body.telefone,
        email:req.body.email,
        facebook:req.body.facebook,
        instagram:req.body.instagram,
        endereco:req.body.endereco,
        data_cadastro:req.body.data_cadastro
    }, {new: true}); 
    if(!ong) res.status(404).send('Ong não encontrada');   
    res.send(ong);
});

router.delete("/:id", async (req, res) => {
    const ong = await Ong.findByIdAndRemove(req.params.id); 
    if(!ong) res.status(404).send('Ong não encontrada');   
    res.send(ong);
});

module.exports = router;