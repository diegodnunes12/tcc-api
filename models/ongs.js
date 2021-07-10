const mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

const OngSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    cnpj: {
        type: String,
        required:true,
        maxlength: 20,
        trim: true
    },
    telefone: {
        type: String,
        required:true,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required:true,
        maxlength: 50,
        trim: true
    },
    facebook: {
        type: String,
        required:false,
        maxlength: 50,
        trim: true
    },
    instagram: {
        type: String,
        required:false,
        maxlength: 50,
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

const ong = mongoose.model("ong", OngSchema);

module.exports = ong;