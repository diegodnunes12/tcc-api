var mongoose = require("mongoose");
const validator = require('validator');

var Schema = mongoose.Schema;

var animalSchema = new Schema ({
    nome: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    pelagem: {
        type: String,
        required:false,
        maxlength: 50,
        trim: true
    },
    sexo: {
        type: String,
        required:true,
        minlength: 3,
        maxlength: 10,
        trim: true
    },
    raca: {
        type: String,
        required:false,
        maxlength: 50,
        trim: true
    },
    idade: {
        type: String,
        required:false,
        maxlength: 20,
        trim: true
    },
    historia: {
        type: String,
        required:false,
        maxlength: 500,
        trim: true
    },
    castrado: {
        type: Boolean,
        required:true
    },
    vacinado: {
        type: Boolean,
        required:true
    },
    vermifugado: {
        type: Boolean,
        required:true
    },
    ong:{
        type: Schema.Types.ObjectId,
        ref: "ong",
        required:true
    },
    especie:{
        type: Schema.Types.ObjectId,
        ref: "especie",
        required:true
    },
    porte:{
        type: Schema.Types.ObjectId,
        ref: "porte",
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
    imagem: {
        type: String
    }
});

var animal = mongoose.model("animal", animalSchema);

module.exports = animal;