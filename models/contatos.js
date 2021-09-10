var mongoose = require("mongoose");
const validator = require('validator');
const { string } = require("yup");

const Schema = mongoose.Schema;

var contatoSchema = new Schema ({
    data_contato: {
        type: Date,
        required:true,
        validator(value){
            if(!validator.Date(value)){
                throw new Error('Informe uma data válida');
            }
        }
    },
    animal: {
        _id: {
            type: Schema.Types.String,
            required:true
        },
        nome: {
            type: Schema.Types.String,
            required:true
        },
        sexo: {
            type: Schema.Types.String,
            required:true
        },
        especie: {
            _id: {
                type: Schema.Types.String,
                required:true
            },
            nome: {
                type: Schema.Types.String,
                required:true
            },
        },
        porte: {
            _id: {
                type: Schema.Types.String,
                required:true
            },
            nome: {
                type: Schema.Types.String,
                required:true
            },
        },
    },
    usuario: {
        _id: {
            type: Schema.Types.String,
            required:true
        },
        nome: {
            type: Schema.Types.String,
            required:true
        }
    },
    ong: {
        type: Schema.Types.ObjectId,
        ref: "ong",
        required:true
    }
});

var contato = mongoose.model("contato", contatoSchema);

module.exports = contato;