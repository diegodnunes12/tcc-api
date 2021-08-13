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
        required:false,
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
    telefone: {
        type: String,
        required:false,
        maxlength: 20,
        trim: true
    },
    tipo_usuario: {
        type: Schema.Types.ObjectId,
        ref: "tipoUsuario",
        required:true
    },
    ong: {
        type: Schema.Types.ObjectId,
        ref: "ong",
        required:false
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