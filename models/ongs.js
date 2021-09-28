var mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

var ongSchema = new Schema ({
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
    cidade: {
        type: String,
        required:true,
        maxlength: 100,
        trim: true
    },
    estado: {
        type: String,
        required:true,
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
    imagem: {
        type: String
    }
});

var ong = mongoose.model("ong", ongSchema);

module.exports = ong;