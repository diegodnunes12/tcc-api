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
        type: Schema.Types.ObjectId,
        ref: "animal",
        required:true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required:true
    },
    ong: {
        type: Schema.Types.ObjectId,
        ref: "ong",
        required:true
    }
});

var contato = mongoose.model("contato", contatoSchema);

module.exports = contato;