const mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

const especieSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    }
});

const especie = mongoose.model("especie", especieSchema);

module.exports = especie;