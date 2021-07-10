var mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

var usuarioOngSchema = new Schema ({
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
    ong:{
        type: Schema.Types.ObjectId,
        ref: "ong",
        required:true
    },
    tipoUsuario:{
        type: Schema.Types.ObjectId,
        ref: "tipoUsuarioOng",
        required:true
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

var usuarioOng = mongoose.model("usuarioOng", usuarioOngSchema);

module.exports = usuarioOng;