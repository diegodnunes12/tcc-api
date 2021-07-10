var mongoose = require("mongoose");
const validator = require('validator');

const Schema = mongoose.Schema;

var mensagemSchema = new Schema ({
    texto: {
        type: String,
        maxlength: 500,
        required:true
    },
    data_mensagem: {
        type: Date,
        required:true,
        validator(value){
            if(!validator.Date(value)){
                throw new Error('Informe uma data válida');
            }
        }
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required:false
    },
    usuarioOng: {
        type: Schema.Types.ObjectId,
        ref: "usuarioOng",
        required:false
    },
    contato: {
        type: Schema.Types.ObjectId,
        ref: "contato",
        required:false
    },
});

var mensagem = mongoose.model("mensagem", mensagemSchema);

module.exports = mensagem;