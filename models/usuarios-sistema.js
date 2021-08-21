var mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

var usuarioSistemaSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required:true,
        maxlength: 50,
        trim: true,
        index: true,
        unique: true
    },
    senha: {
        type: String,
        required:true,
        maxlength: 50
    },
    telefone: {
        type: String,
        required:false,
        maxlength: 20,
        trim: true
    },
    data_cadastro: {
        type: Date,
        required:true,
        validator(value){
            if(!validator.Date(value)){
                throw new Error('Informe uma data válida');
            }
        }
    },
});

var usuarioSistema = mongoose.model("usuarioSistema", usuarioSistemaSchema);

module.exports = usuarioSistema;