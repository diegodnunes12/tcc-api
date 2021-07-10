var mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

var usuarioSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    cpf: {
        type: String,
        required:true,
        maxlength: 15,
        trim: true,
        index: true,
        unique: true
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
    data_nascimento: {
        type: Date,
        required:true,
        validator(value){
            if(!validator.Date(value)){
                throw new Error('Informe uma data válida');
            }
        }
    },
    telefone: {
        type: String,
        required:true,
        maxlength: 20,
        trim: true
    },
    endereco: {
        type: String,
        required:true,
        maxlength: 100,
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

var usuario = mongoose.model("usuario", usuarioSchema);

module.exports = usuario;