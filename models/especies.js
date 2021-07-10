var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var especieSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    }
});

var especie = mongoose.model("especie", especieSchema);

module.exports = especie;