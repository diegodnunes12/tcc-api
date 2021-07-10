const mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

const porteSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    }
});

const porte = mongoose.model("porte", porteSchema);

module.exports = porte;